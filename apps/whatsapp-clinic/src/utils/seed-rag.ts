import 'dotenv/config';
import { ingest } from './rag-client';

const NAMESPACE = 'clinic-info';

const documents = [
  {
    content: `Dr. Ahmed Salem is a dentist at our clinic.
Specialty: Dentistry (dental fillings, extractions, teeth cleaning, crowns, root canals).
Consultation fee: 300 EGP.
Available sessions: he works on specific days — use the booking system to see his live availability.`,
    metadata: { doctor: 'Dr. Ahmed Salem', specialty: 'dentist' },
  },
  {
    content: `Dr. Sara Khaled is a dermatologist at our clinic.
Specialty: Dermatology (acne treatment, skin allergies, hair loss, cosmetic skin procedures).
Consultation fee: 400 EGP.
Available sessions: she works on specific days — use the booking system to see her live availability.`,
    metadata: { doctor: 'Dr. Sara Khaled', specialty: 'dermatologist' },
  },
  {
    content: `Dr. Omar Fathy is a general medicine doctor at our clinic.
Specialty: General medicine (fever, cold, chronic disease follow-up, blood pressure, diabetes management).
Consultation fee: 200 EGP.
Available sessions: he works on specific days — use the booking system to see his live availability.`,
    metadata: { doctor: 'Dr. Omar Fathy', specialty: 'general' },
  },
  {
    content: `Dr. Mona Hassan is a pediatrician at our clinic.
Specialty: Pediatrics (children's health, vaccinations, growth monitoring, common childhood illnesses).
Consultation fee: 350 EGP.
Available sessions: she works on specific days — use the booking system to see her live availability.`,
    metadata: { doctor: 'Dr. Mona Hassan', specialty: 'pediatrics' },
  },
  {
    content: `Clinic general information:
- Specialties available: Dentistry, Dermatology, General Medicine, Pediatrics.
- To book an appointment, patients must provide their full name and phone number.
- Cancellations must be done before the appointment time. Use your reservation ID to cancel.
- Reservation IDs are provided after a successful booking (format: CLN-XXXX).
- The clinic bot can show available slots, book appointments, and cancel reservations.`,
    metadata: { type: 'clinic-policy' },
  },
];

async function seed() {
  console.log(`Seeding ${documents.length} documents into namespace "${NAMESPACE}"...`);

  for (const doc of documents) {
    await ingest(NAMESPACE, doc.content, doc.metadata);
    console.log(`  ✓ Ingested: ${doc.metadata.doctor ?? doc.metadata.type}`);
  }

  console.log('Done. RAG knowledge base is ready.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
