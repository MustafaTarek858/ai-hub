export type Session = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  isBooked: boolean;
};

export type Reservation = {
  id: string;
  sessionId: string;
  patientName: string;
  patientPhone: string;
};

// Mock available sessions
export const sessions: Session[] = [
  { id: 's1', doctor: 'Dr. Ahmed Salem',   specialty: 'dentist',       date: '2026-06-25', time: '10:00 AM', isBooked: false },
  { id: 's2', doctor: 'Dr. Ahmed Salem',   specialty: 'dentist',       date: '2026-06-25', time: '02:00 PM', isBooked: false },
  { id: 's3', doctor: 'Dr. Sara Khaled',   specialty: 'dermatologist', date: '2026-06-25', time: '11:00 AM', isBooked: false },
  { id: 's4', doctor: 'Dr. Sara Khaled',   specialty: 'dermatologist', date: '2026-06-26', time: '03:00 PM', isBooked: false },
  { id: 's5', doctor: 'Dr. Omar Fathy',    specialty: 'general',       date: '2026-06-26', time: '09:00 AM', isBooked: false },
  { id: 's6', doctor: 'Dr. Omar Fathy',    specialty: 'general',       date: '2026-06-26', time: '01:00 PM', isBooked: false },
  { id: 's7', doctor: 'Dr. Mona Hassan',   specialty: 'pediatrics',    date: '2026-06-27', time: '10:00 AM', isBooked: false },
  { id: 's8', doctor: 'Dr. Mona Hassan',   specialty: 'pediatrics',    date: '2026-06-27', time: '04:00 PM', isBooked: false },
];

// Reservations stored in memory (replace with DB later)
export const reservations: Reservation[] = [];
