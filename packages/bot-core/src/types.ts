export type ToolDefinition = {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, { type: string; description: string }>;
      required?: string[];
    };
  };
};

export type Tool = {
  definition: ToolDefinition;
  handler: (args: Record<string, string>) => Promise<string>;
};

export type BotConfig = {
  systemPrompt: string;
  tools: Tool[];
  apiKey: string;
  model?: string;
};

export type ConversationMessage = {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_call_id?: string;
  name?: string;
};
