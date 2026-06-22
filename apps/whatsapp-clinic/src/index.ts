import 'dotenv/config';
import { createBotServer } from '@ai-hub/bot-core';
import { getAvailableSessions } from './tools/getAvailableSessions';
import { bookSession } from './tools/bookSession';
import { cancelReservation } from './tools/cancelReservation';

createBotServer(
  {
    systemPrompt: `You are a helpful assistant for a medical clinic.
Your job is to help patients:
1. View available appointment sessions
2. Book appointments
3. Cancel reservations

Always be polite and professional.
When booking, always ask for the patient's name if not provided.
When showing sessions, format them clearly.
Respond in the same language the patient uses.`,

    tools: [
      getAvailableSessions,
      bookSession,
      cancelReservation,
    ],

    apiKey: process.env.GROQ_API_KEY ?? '',
  },
  3001
);
