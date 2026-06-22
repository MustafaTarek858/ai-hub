import Groq from 'groq-sdk';

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

let _client: Groq | null = null;

export function getGroqClient(apiKey: string): Groq {
  if (!_client) {
    _client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  }
  return _client;
}

export async function chat(
  messages: Message[],
  apiKey: string,
  model = 'llama-3.3-70b-versatile'
): Promise<string> {
  const groq = getGroqClient(apiKey);
  const response = await groq.chat.completions.create({ model, messages });
  return response.choices[0]?.message?.content ?? '';
}

export async function* chatStream(
  messages: Message[],
  apiKey: string,
  model = 'llama-3.3-70b-versatile'
): AsyncGenerator<string> {
  const groq = getGroqClient(apiKey);
  const stream = await groq.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
