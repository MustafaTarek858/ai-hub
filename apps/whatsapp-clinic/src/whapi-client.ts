import express from 'express';
import axios from 'axios';
import { runBot } from '@ai-hub/bot-core';
import type { BotConfig, ConversationMessage } from '@ai-hub/bot-core';
import { detectLanguage, getLanguageInstruction, stripForeignCharacters } from './utils/language';
import { query } from './utils/rag-client';

const sessions = new Map<string, ConversationMessage[]>();

async function sendReply(to: string, text: string, token: string) {
  await axios.post(
    'https://gate.whapi.cloud/messages/text',
    { to, body: text },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );
}

export function startWhapiBot(config: BotConfig, token: string, port = 3001) {
  const app = express();
  app.use(express.json());

  app.get('/', (_req, res) => res.send('Clinic bot is running'));

  app.get('/webhook', (_req, res) => res.sendStatus(200));

  app.post('/webhook', async (req, res) => {
    res.sendStatus(200);

    const messages = req.body?.messages;
    if (!Array.isArray(messages)) return;

    for (const msg of messages) {
      if (msg.from_me) continue;
      const text = msg.text?.body || msg.body || '';
      if (!text) continue;

      const from = msg.chat_id || msg.from;
      console.log(`[${from}]: ${text}`);

      const history = sessions.get(from) ?? [];

      try {
        const lang = detectLanguage(text);
        const langInstruction = getLanguageInstruction(lang);

        // Enrich system prompt with relevant clinic knowledge from RAG
        let enrichedConfig = config;
        try {
          const { context, sources } = await query('clinic-info', text, 3);
          if (context) {
            console.log(`[RAG] fetched ${sources.length} chunks for: "${text.slice(0, 60)}"`);
            enrichedConfig = {
              ...config,
              systemPrompt: `${config.systemPrompt}\n\n--- CLINIC KNOWLEDGE BASE ---\n${context}\n--- END OF KNOWLEDGE BASE ---`,
            };
          } else {
            console.log(`[RAG] no context returned for: "${text.slice(0, 60)}"`);
          }
        } catch (err: any) {
          console.warn(`[RAG] unavailable — continuing without context (${err?.message})`);
        }

        let reply = await runBot(text, history, enrichedConfig, langInstruction);

        // Strip Qwen3 thinking blocks
        reply = reply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        // Strip leaked function call syntax
        reply = reply.replace(/<function=.*?<\/function>/gs, '').trim();
        // Strip leaked tool/JSON blocks
        reply = reply.replace(/<tools>[\s\S]*?<\/tools>/g, '').trim();
        reply = reply.replace(/```json[\s\S]*?```/g, '').trim();
        // Force reply language to Arabic or English only
        const replyLang = detectLanguage(reply);
        reply = stripForeignCharacters(reply, replyLang === 'ar' ? 'ar' : 'en');

        sessions.set(from, [
          ...history,
          { role: 'user', content: text },
          { role: 'assistant', content: reply },
        ]);

        await sendReply(from, reply, token);
      } catch (err: any) {
        console.error('Bot error:', err?.message ?? err);
        try {
          await sendReply(from, 'عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى.', token);
        } catch {}
      }
    }
  });

  app.listen(port, () => {
    console.log(`Clinic bot running on port ${port}`);
    console.log(`Webhook URL: http://localhost:${port}/webhook`);
  });
}
