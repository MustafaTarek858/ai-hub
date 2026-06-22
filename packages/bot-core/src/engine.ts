import Groq from 'groq-sdk';
import type { BotConfig, ConversationMessage } from './types';

export async function runBot(
  userMessage: string,
  history: ConversationMessage[],
  config: BotConfig
): Promise<string> {
  const groq = new Groq({ apiKey: config.apiKey });
  const model = config.model ?? 'llama-3.3-70b-versatile';

  // Build the full message list
  const messages: ConversationMessage[] = [
    { role: 'system', content: config.systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  // Extract just the tool definitions to send to Groq
  const toolDefinitions = config.tools.map((t) => t.definition);

  // Step 1 — send to Groq with tools list
  const response = await groq.chat.completions.create({
    model,
    messages: messages as any,
    tools: toolDefinitions as any,
    tool_choice: 'auto',
  });

  const aiMessage = response.choices[0].message;

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
