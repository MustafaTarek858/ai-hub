import 'dotenv/config';
import express from 'express';
import { chat } from '@ai-hub/ai-core';
import type { Message } from '@ai-hub/ai-core';

const app = express();
app.use(express.urlencoded({ extended: false }));

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? '';
const sessions = new Map<string, Message[]>();

app.post('/webhook', async (req, res) => {
  const incomingMsg = req.body.Body as string;
  const from = req.body.From as string;

  const history = sessions.get(from) ?? [];
  const messages: Message[] = [...history, { role: 'user', content: incomingMsg }];

  const reply = await chat(messages, GROQ_API_KEY);
  sessions.set(from, [...messages, { role: 'assistant', content: reply }]);

  res.type('text/xml').send(`
    <Response>
      <Message>${reply}</Message>
    </Response>
  `);
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`WhatsApp bot listening on port ${PORT}`));
