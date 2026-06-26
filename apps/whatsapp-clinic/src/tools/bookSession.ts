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

    if (!args.patient_name?.trim()) {
      return `ERROR: Patient name is required to complete the booking.`;
    }

    if (!args.patient_phone?.trim()) {
      return `ERROR: Patient phone number is required to complete the booking.`;
    }

    if (!session) {
      return `ERROR: Session "${args.session_id}" does not exist. Please ask the patient to choose a valid session from the available list.`;
    }

    if (session.isBooked) {
      return `ERROR: Session "${args.session_id}" is already booked. Please show the patient other available sessions.`;
    }

    session.isBooked = true;

    const reservationId = `CLN-${Math.floor(1000 + Math.random() * 9000)}`;
    reservations.push({
      id: reservationId,
      sessionId: session.id,
      patientName: args.patient_name,
      patientPhone: args.patient_phone,
    });

    return `BOOKING_SUCCESS
Reservation ID: ${reservationId}
Patient: ${args.patient_name}
Phone: ${args.patient_phone}
Doctor: ${session.doctor}
Specialty: ${session.specialty}
Date: ${session.date}
Time: ${session.time}`;
  },
};
