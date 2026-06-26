import Groq from 'groq-sdk';
import type { BotConfig, ConversationMessage } from './types';

export async function runBot(
  userMessage: string,
  history: ConversationMessage[],
  config: BotConfig,
  languageInstruction?: string
): Promise<string> {
  const groq = new Groq({ apiKey: config.apiKey });
  const model = config.model ?? 'llama-3.3-70b-versatile';

  const systemPrompt = languageInstruction
    ? `${config.systemPrompt}\n\n${languageInstruction}`
    : config.systemPrompt;

  // Build the full message list
  const messages: ConversationMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  // Extract just the tool definitions to send to Groq
  const toolDefinitions = config.tools.map((t) => t.definition);

  let aiMessage: any;

  try {
    // Step 1 — send to Groq with tools list
    const response = await groq.chat.completions.create({
      model,
      messages: messages as any,
      tools: toolDefinitions as any,
      tool_choice: 'auto',
    });
    aiMessage = response.choices[0].message;
  } catch (err: any) {
    // Handle malformed tool call — model output <function=name {...}> as text
    const failedGen = err?.error?.error?.failed_generation as string | undefined;
    if (err?.status === 400 && failedGen) {
      const match = failedGen.match(/<function=(\w+)\s+(\{.*?\})\s*<\/function>/s);
      if (match) {
        const toolName = match[1];
        const toolArgs = JSON.parse(match[2]);
        const tool = config.tools.find((t) => t.definition.function.name === toolName);
        if (tool) {
          const toolResult = await tool.handler(toolArgs);
          const recovery = await groq.chat.completions.create({
            model,
            messages: [
              ...messages as any,
              { role: 'assistant', content: `I need to call ${toolName}` },
              { role: 'user', content: `Tool result: ${toolResult}` },
            ],
          });
          return recovery.choices[0].message.content ?? 'No response.';
        }
      }
    }
    throw err;
  }

  // Step 2 — check if Groq wants to call a tool
  if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
    const toolCall = aiMessage.tool_calls[0];
    const toolName = toolCall.function.name;
    const toolArgs = JSON.parse(toolCall.function.arguments);

    // Step 3 — find the matching tool and run it
    const tool = config.tools.find((t) => t.definition.function.name === toolName);

    if (!tool) {
      return "Sorry, something went wrong. Please try again.";
    }

    const toolResult = await tool.handler(toolArgs);

    // Step 4 — send the result back to Groq
    const followUp = await groq.chat.completions.create({
      model,
      messages: [
        ...messages as any,
        aiMessage,
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResult,
        },
      ],
    });

    return followUp.choices[0].message.content ?? 'No response.';
  }

  // No tool call — just return the text response
  return aiMessage.content ?? 'No response.';
}
