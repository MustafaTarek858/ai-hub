export const env = {
  GROQ_API_KEY: getRequired('VITE_GROQ_API_KEY'),
  GROQ_MODEL: import.meta.env?.VITE_GROQ_MODEL ?? 'llama-3.3-70b-versatile',
} as const;

function getRequired(key: string): string {
  const value = import.meta.env?.[key] ?? process.env?.[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}
