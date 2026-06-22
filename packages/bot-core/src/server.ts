import express from 'express';
import type { BotConfig, ConversationMessage } from './types';
import { runBot } from './engine';

export function createBotServer(config: BotConfig, port = 3001) {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // In-memory session store: phone → conversation history
  const sessions = new Map<string, ConversationMessage[]>();

  app.post('/webhook', async (req, res) => {
    const incomingMsg = (req.body.Body as string)?.trim();
    const from = req.body.From as string;

    if (!incomingMsg) {
      return res.sendStatus(400);
    }

    const history = sessions.get(from) ?? [];

    try {
      const reply = await runBot(incomingMsg, history, config);

      // Save conversation history
      sessions.set(from, [
        ...history,
        { role: 'user', content: incomingMsg },
        { role: 'assistant', content: reply },
      ]);

      // Twilio expects TwiML XML response
      res.type('text/xml').send(`
        <Response>
          <Message>${reply}</Message>
        </Response>
      `);
    } catch (err) {
      console.error('Bot error:', err);
      res.type('text/xml').send(`
        <Response>
          <Message>Sorry, something went wrong. Please try again.</Message>
        </Response>
      `);
    }
  });

  // Health check
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.listen(port, () => {
    console.log(`Bot server running on port ${port}`);
    console.log(`Webhook: http://localhost:${port}/webhook`);
  });
}
