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

type OpenAiMessage = Record<string, unknown> & { role: string; content?: string | null };
type OpenAiTool = { type: "function"; function: { name: string; description: string; parameters: AiTool["input_schema"] } };

function toOpenAiMessages(request: ProviderRequest): OpenAiMessage[] {
  const messages: OpenAiMessage[] = [{ role: "system", content: request.system }];

  for (const message of request.messages) {
    if (typeof message.content === "string") {
      messages.push({ role: message.role, content: message.content });
      continue;
    }

    if (message.role === "assistant") {
      const text = message.content
        .filter((block) => block.type === "text")
        .map((block) => String(block.text ?? ""))
        .join("\n");
      const toolCalls = message.content
        .filter((block) => block.type === "tool_use")
        .map((block) => ({
          id: String(block.id),
          type: "function" as const,
          function: {
            name: String(block.name),
            arguments: JSON.stringify(block.input ?? {}),
          },
        }));

      messages.push({
        role: "assistant",
        content: text || null,
        ...(toolCalls.length ? { tool_calls: toolCalls } : {}),
      });
      continue;
    }

    for (const block of message.content) {
      if (block.type === "tool_result") {
        messages.push({
          role: "tool",
          tool_call_id: String(block.tool_use_id),
          content: String(block.content ?? ""),
        });
      }
    }
  }

  return messages;
}

function toOpenAiTools(tools: AiTool[]): OpenAiTool[] {
  return tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.input_schema,
    },
  }));
}

class GrokProvider implements AiProvider {
  async createMessage(request: ProviderRequest): Promise<AiResponse> {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) throw new Error("MIRA is missing XAI_API_KEY. Add it to the deployment environment.");

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || "grok-3-mini",
        max_tokens: 1800,
        temperature: 0.2,
        messages: toOpenAiMessages(request),
        tools: toOpenAiTools(request.tools),
        tool_choice: "auto",
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Grok request failed (${response.status}): ${detail.slice(0, 500)}`);
    }

    const payload = (await response.json()) as {
      id?: string;
      choices?: Array<{
        finish_reason?: string | null;
        message?: {
          content?: string | null;
          tool_calls?: Array<{
            id?: string;
            function?: { name?: string; arguments?: string };
          }>;
        };
      }>;
    };
    const choice = payload.choices?.[0];
    const message = choice?.message;
    const content: AiResponse["content"] = [];

    if (message?.content) content.push({ type: "text", text: message.content });
    for (const toolCall of message?.tool_calls ?? []) {
      let input: Record<string, unknown> = {};
      try {
        input = JSON.parse(toolCall.function?.arguments || "{}");
      } catch {
        throw new Error(`Grok returned invalid arguments for ${toolCall.function?.name || "a tool"}.`);
      }
      content.push({
        type: "tool_use",
        id: toolCall.id || crypto.randomUUID(),
        name: toolCall.function?.name || "unknown",
        input,
      });
    }

    return {
      id: payload.id || crypto.randomUUID(),
      stop_reason: choice?.finish_reason || null,
      content,
    };
  }
}

export function getAiProvider(): AiProvider {
  return new GrokProvider();
}
