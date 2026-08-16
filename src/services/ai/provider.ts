export type AiMessage = {
  role: "user" | "assistant";
  content: string | Array<Record<string, unknown>>;
};

export type AiTool = {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  };
};

export type AiResponse = {
  id: string;
  stop_reason: string | null;
  content: Array<
    | { type: "text"; text: string }
    | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  >;
};

export type ProviderRequest = {
  system: string;
  messages: AiMessage[];
  tools: AiTool[];
};

export interface AiProvider {
  createMessage(request: ProviderRequest): Promise<AiResponse>;
}

class AnthropicProvider implements AiProvider {
  async createMessage(request: ProviderRequest): Promise<AiResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("MIRA is missing ANTHROPIC_API_KEY. Add it to the deployment environment.");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 1800,
        system: request.system,
        messages: request.messages,
        tools: request.tools,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Anthropic request failed (${response.status}): ${detail.slice(0, 500)}`);
    }

    return (await response.json()) as AiResponse;
  }
}

export function getAiProvider(): AiProvider {
  return new AnthropicProvider();
}
