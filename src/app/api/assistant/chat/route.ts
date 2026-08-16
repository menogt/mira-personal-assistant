import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getAiProvider, type AiMessage } from "@/services/ai/provider";
import { ASSISTANT_TOOLS, executeAssistantTool } from "@/features/assistant/tools";

const SYSTEM = `You are MIRA (Menaka's Intelligent Routine Assistant), a calm, direct personal routine assistant. Be lightly dry and practical, not falsely motivational. You have access only to the user's real database through tools; never invent tasks, projects, notes, modules, dates, or progress. If a tool cannot find something, say so plainly. Use tools whenever the user asks about their data or asks you to act. Before encouraging a new project or app, inspect existing projects and mention active or stalled work when relevant. Push back on overload with facts, not cheerleading. Notes are a dumping ground: creating a note must never create a task or project. Keep replies concise but useful.`;

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json() as { messages?: AiMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
    if (!messages.length) return NextResponse.json({ error: "A message is required." }, { status: 400 });

    const provider = getAiProvider();
    const toolEvents: Array<{ name: string; input: Record<string, unknown>; result?: Record<string, unknown>; error?: string }> = [];
    let current = messages;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const response = await provider.createMessage({ system: SYSTEM, messages: current, tools: ASSISTANT_TOOLS });
      const toolUses = response.content.filter((block): block is Extract<typeof block, { type: "tool_use" }> => block.type === "tool_use");
      const text = response.content.filter((block): block is Extract<typeof block, { type: "text" }> => block.type === "text").map(block => block.text).join("\n").trim();
      if (!toolUses.length) return NextResponse.json({ message: text || "I have nothing useful to add yet.", toolEvents });

      current = [...current, { role: "assistant", content: response.content as Array<Record<string, unknown>> }];
      const results = [] as Array<Record<string, unknown>>;
      for (const tool of toolUses) {
        const event = { name: tool.name, input: tool.input } as { name: string; input: Record<string, unknown>; result?: Record<string, unknown>; error?: string };
        try { event.result = await executeAssistantTool(tool.name, tool.input, user.id); results.push({ type: "tool_result", tool_use_id: tool.id, content: JSON.stringify(event.result) }); }
        catch (error) { event.error = error instanceof Error ? error.message : "Tool failed."; results.push({ type: "tool_result", tool_use_id: tool.id, content: JSON.stringify({ error: event.error }) }); }
        toolEvents.push(event);
      }
      current = [...current, { role: "user", content: results }];
    }
    return NextResponse.json({ message: "I stopped after several database steps to avoid an endless loop. The completed tool actions are shown below.", toolEvents });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Assistant request failed.";
    const status = message.includes("XAI_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
