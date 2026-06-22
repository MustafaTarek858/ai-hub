import type { Tool } from '@ai-hub/bot-core';
import { sessions, reservations } from '../data/mockData';

export const cancelReservation: Tool = {
  definition: {
    type: 'function',
    function: {
      name: 'cancelReservation',
      description: 'Cancel an existing reservation. Use when patient wants to cancel their appointment.',
      parameters: {
        type: 'object',
        properties: {
          reservation_id: {
            type: 'string',
            description: 'The reservation ID to cancel (e.g. r1234567890)',
          },
        },
        required: ['reservation_id'],
      },
    },
  },

  handler: async (args) => {
    const index = reservations.findIndex((r) => r.id === args.reservation_id);

    if (index === -1) {
      return `Reservation ${args.reservation_id} not found.`;
    }

    const reservation = reservations[index];
    const session = sessions.find((s) => s.id === reservation.sessionId);

    // Free up the session
    if (session) session.isBooked = false;

    // Remove reservation
    reservations.splice(index, 1);

    return `Reservation ${args.reservation_id} has been cancelled successfully. The slot is now available for others.`;
  },
};
