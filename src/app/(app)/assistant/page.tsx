"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ToolEvent = { name: string; input: Record<string, unknown>; error?: string };

const starters = ["What is on my plate today?", "Find my recent project notes.", "Give me a blunt weekly review."];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [toolEvents, setToolEvents] = useState<ToolEvent[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function send(value = input) {
    const text = value.trim();
    if (!text || pending) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next); setInput(""); setError(""); setPending(true);
    try {
      const response = await fetch("/api/assistant/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = await response.json() as { message?: string; error?: string; toolEvents?: ToolEvent[] };
      if (!response.ok) throw new Error(data.error || "Assistant request failed.");
      setMessages([...next, { role: "assistant", content: data.message || "No response." }]);
      setToolEvents(data.toolEvents || []);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Assistant request failed."); }
    finally { setPending(false); }
  }

  return <>
    <PageHeader title="Assistant" description="Ask MIRA to inspect the real database or make a small, explicit change. It will not invent a cheerful version of your workload." />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="flex min-h-[34rem] flex-col rounded-md border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {!messages.length ? <div className="flex h-full min-h-72 flex-col items-center justify-center text-center"><p className="text-lg font-medium text-zinc-200">What needs sorting?</p><p className="mt-2 max-w-md text-sm text-zinc-500">MIRA can read your tasks, notes, projects, deadlines, and study records. It can also change them when you ask.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{starters.map(starter=><button key={starter} onClick={()=>send(starter)} className="rounded-full border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:border-emerald-400 hover:text-emerald-200">{starter}</button>)}</div></div> : messages.map((message,index)=><div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-2xl rounded-xl rounded-br-sm bg-emerald-400/15 px-4 py-3 text-sm text-emerald-50" : "max-w-2xl rounded-xl rounded-bl-sm border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm leading-6 text-zinc-200"}><p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{message.role === "user" ? "You" : "MIRA"}</p><p className="whitespace-pre-wrap">{message.content}</p></div>)}
          {pending ? <div className="max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-500">Checking the actual records. A rare moment of administrative honesty…</div> : null}
        </div>
        {error ? <p className="mt-3 rounded-md border border-rose-900/60 bg-rose-950/30 px-3 py-2 text-sm text-rose-300">{error}</p> : null}
        <form onSubmit={e=>{e.preventDefault();void send();}} className="mt-4 flex gap-2 border-t border-zinc-800 pt-4"><Textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask MIRA something…" className="min-h-12 resize-none"/><Button type="submit" disabled={pending || !input.trim()}>{pending ? "Working…" : "Send"}</Button></form>
      </section>
      <aside className="rounded-md border border-zinc-800 bg-zinc-950 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Tool activity</p>{toolEvents.length ? <ul className="mt-4 space-y-3">{toolEvents.map((event,index)=><li key={`${event.name}-${index}`} className="border-l border-emerald-400/40 pl-3 text-sm"><p className="font-medium text-zinc-200">{event.name}</p><p className="mt-1 text-xs text-zinc-500">{event.error || "Database result returned"}</p></li>)}</ul> : <p className="mt-4 text-sm leading-6 text-zinc-500">Actions MIRA takes appear here. No theatre, just the database calls.</p>}</aside>
    </div>
  </>;
}
