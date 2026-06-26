import { GoogleGenerativeAI, Tool as GeminiTool } from '@google/generative-ai';
import type { BotConfig, ConversationMessage } from './types';

export async function runBotGemini(
  userMessage: string,
  history: ConversationMessage[],
  config: BotConfig,
  languageInstruction?: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(config.apiKey);

  const systemPrompt = languageInstruction
    ? `${config.systemPrompt}\n\n${languageInstruction}`
    : config.systemPrompt;

  const tools: GeminiTool[] = [
    {
      functionDeclarations: config.tools.map((t) => ({
        name: t.definition.function.name,
        description: t.definition.function.description,
        parameters: t.definition.function.parameters as any,
      })),
    },
  ];

  const model = genAI.getGenerativeModel({
    model: config.model ?? 'gemini-1.5-flash-latest',
    systemInstruction: systemPrompt,
    tools,
  });

  const geminiHistory = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const chat = model.startChat({ history: geminiHistory });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;

  const functionCall = response.candidates?.[0]?.content?.parts?.find(
    (p: any) => p.functionCall
  );

  if (functionCall?.functionCall) {
    const { name, args } = functionCall.functionCall;
    const tool = config.tools.find((t) => t.definition.function.name === name);

    if (!tool) return 'Sorry, something went wrong. Please try again.';

    const toolResult = await tool.handler(args as Record<string, string>);

    const followUp = await chat.sendMessage([
      {
        functionResponse: {
          name,
          response: { result: toolResult },
        },
      } as any,
    ]);

    return followUp.response.text();
  }

  return response.text();
}
