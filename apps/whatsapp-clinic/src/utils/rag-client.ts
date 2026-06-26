const RAG_BASE_URL = process.env.RAG_BASE_URL ?? '';
const RAG_API_KEY = process.env.RAG_API_KEY ?? '';

type RagError = { status: number; body: string };

function ragHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-api-key': RAG_API_KEY,
  };
}

async function checkResponse(res: Response): Promise<void> {
  if (res.ok) return;

  const body = await res.text().catch(() => '');
  const err: RagError = { status: res.status, body };

  if (res.status === 401) throw Object.assign(new Error('RAG: unauthorized — check RAG_API_KEY'), err);
  if (res.status === 422) throw Object.assign(new Error(`RAG: validation error — ${body}`), err);
  throw Object.assign(new Error(`RAG: server error ${res.status} — ${body}`), err);
}

export async function ingest(
  namespace: string,
  content: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const res = await fetch(`${RAG_BASE_URL}/ingest`, {
    method: 'POST',
    headers: ragHeaders(),
    body: JSON.stringify({ namespace, content, metadata }),
  });
  await checkResponse(res);
}

export async function query(
  namespace: string,
  question: string,
  topK = 5
): Promise<{ context: string; sources: unknown[] }> {
  const res = await fetch(`${RAG_BASE_URL}/query`, {
    method: 'POST',
    headers: ragHeaders(),
    body: JSON.stringify({ namespace, question, top_k: topK }),
  });
  await checkResponse(res);
  return res.json();
}
