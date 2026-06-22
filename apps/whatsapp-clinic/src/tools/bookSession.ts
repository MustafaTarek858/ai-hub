import type { Tool } from '@ai-hub/bot-core';
import { sessions, reservations } from '../data/mockData';

export const bookSession: Tool = {
  definition: {
    type: 'function',
    function: {
      name: 'bookSession',
      description: 'Book an appointment session for a patient. Use when patient confirms they want to book a specific session.',
      parameters: {
        type: 'object',
        properties: {
          session_id: {
            type: 'string',
            description: 'The session ID to book (e.g. s1, s2)',
          },
          patient_name: {
            type: 'string',
            description: 'Full name of the patient',
          },
          patient_phone: {
            type: 'string',
            description: 'Phone number of the patient',
          },
        },
        required: ['session_id', 'patient_name', 'patient_phone'],
      },
    },
  },

  handler: async (args) => {
    const session = sessions.find((s) => s.id === args.session_id);

    if (!session) {
      return `Session ${args.session_id} not found.`;
    }

    if (session.isBooked) {
      return `Sorry, session ${args.session_id} is already booked. Please choose another.`;
    }

    // Mark as booked
    session.isBooked = true;

    // Create reservation
    const reservationId = `r${Date.now()}`;
    reservations.push({
      id: reservationId,
      sessionId: session.id,
      patientName: args.patient_name,
      patientPhone: args.patient_phone,
    });

    return `Booking confirmed!
Reservation ID: ${reservationId}
Patient: ${args.patient_name}
Doctor: ${session.doctor} (${session.specialty})
Date: ${session.date} at ${session.time}
To cancel, say: cancel ${reservationId}`;
  },
};
