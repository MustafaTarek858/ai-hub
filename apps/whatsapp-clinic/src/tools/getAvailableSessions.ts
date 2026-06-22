import type { Tool } from '@ai-hub/bot-core';
import { sessions } from '../data/mockData';

export const getAvailableSessions: Tool = {
  definition: {
    type: 'function',
    function: {
      name: 'getAvailableSessions',
      description: 'Get available appointment sessions. Use when patient asks about available times, slots, or appointments.',
      parameters: {
        type: 'object',
        properties: {
          specialty: {
            type: 'string',
            description: 'Medical specialty e.g. dentist, dermatologist, general, pediatrics. Leave empty for all.',
          },
          date: {
            type: 'string',
            description: 'Date in YYYY-MM-DD format. Leave empty for all upcoming dates.',
          },
        },
      },
    },
  },

  handler: async (args) => {
    let available = sessions.filter((s) => !s.isBooked);

    if (args.specialty) {
      available = available.filter((s) =>
        s.specialty.toLowerCase().includes(args.specialty.toLowerCase())
      );
    }

    if (args.date) {
      available = available.filter((s) => s.date === args.date);
    }

    if (available.length === 0) {
      return 'No available sessions found for those criteria.';
    }

    const formatted = available.map(
      (s) => `[${s.id}] ${s.doctor} (${s.specialty}) — ${s.date} at ${s.time}`
    ).join('\n');

    return `Available sessions:\n${formatted}`;
  },
};
