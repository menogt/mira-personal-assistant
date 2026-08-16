import { createClient } from "@/lib/supabase/server";
import { getUpcomingDeadlines } from "@/features/dashboard/deadline-queries";
import type { AiTool } from "@/services/ai/provider";

const todayFor = (timezone: string) => new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(new Date());
const isoDaysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();
async function timezoneFor(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("profiles").select("timezone").eq("id", userId).maybeSingle();
  return data?.timezone || "Asia/Colombo";
}

export const ASSISTANT_TOOLS: AiTool[] = [
  { name: "create_task", description: "Create one task in the real MIRA database. Use only when the user explicitly asks to create or add a task.", input_schema: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, category: { type: "string", enum: ["university", "project", "freelance", "health", "personal", "content", "finance", "general"] }, priority: { type: "string", enum: ["low", "medium", "high", "urgent"] }, due_at: { type: "string", description: "ISO datetime or YYYY-MM-DD" }, recurrence: { type: "string" }, project_id: { type: "string" }, goal_id: { type: "string" } }, required: ["title"], additionalProperties: false } },
  { name: "complete_task", description: "Complete an existing task by its exact database id.", input_schema: { type: "object", properties: { task_id: { type: "string" } }, required: ["task_id"], additionalProperties: false } },
  { name: "create_note", description: "Save a dumping-ground note. Never create a task or project from a note.", input_schema: { type: "object", properties: { title: { type: "string" }, content: { type: "string" }, note_type: { type: "string", enum: ["idea", "link", "reflection", "university", "project", "meeting", "content", "general"] }, source_url: { type: "string" } }, required: ["title", "content"], additionalProperties: false } },
  { name: "find_notes", description: "Search the user's notes by text and/or type. Return only matching database records.", input_schema: { type: "object", properties: { query: { type: "string" }, note_type: { type: "string" }, limit: { type: "integer" } }, additionalProperties: false } },
  { name: "update_project", description: "Update an existing project by exact project id. Do not invent ids or project names.", input_schema: { type: "object", properties: { project_id: { type: "string" }, status: { type: "string" }, priority: { type: "string" }, progress: { type: "integer" }, next_action: { type: "string" }, blocker: { type: "string" }, notes: { type: "string" } }, required: ["project_id"], additionalProperties: false } },
  { name: "get_today_plan", description: "Read today's real task plan, including incomplete due-today tasks and the highest-priority task.", input_schema: { type: "object", properties: {}, additionalProperties: false } },
  { name: "get_upcoming_deadlines", description: "Read real project and university deadlines in the next seven days.", input_schema: { type: "object", properties: {}, additionalProperties: false } },
  { name: "log_study_session", description: "Log a real university study session for an existing module.", input_schema: { type: "object", properties: { module_id: { type: "string" }, duration_minutes: { type: "integer" }, topic: { type: "string" }, session_date: { type: "string" }, notes: { type: "string" } }, required: ["module_id", "duration_minutes"], additionalProperties: false } },
  { name: "generate_weekly_review", description: "Summarize the real last seven days of tasks, study sessions, notes, and upcoming deadlines.", input_schema: { type: "object", properties: {}, additionalProperties: false } },
];

export async function executeAssistantTool(name: string, input: Record<string, unknown>, userId: string): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  if (name === "create_task") {
    const { data, error } = await supabase.from("tasks").insert({ user_id: userId, title: String(input.title), description: input.description ? String(input.description) : null, category: String(input.category || "general"), priority: String(input.priority || "medium"), status: "todo", due_at: input.due_at ? String(input.due_at) : null, recurrence: input.recurrence ? String(input.recurrence) : null, project_id: input.project_id ? String(input.project_id) : null, goal_id: input.goal_id ? String(input.goal_id) : null }).select("id,title,status,due_at,priority").single();
    if (error) throw new Error(error.message); return { created: data };
  }
  if (name === "complete_task") {
    const { data, error } = await supabase.from("tasks").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", String(input.task_id)).eq("user_id", userId).select("id,title,status,completed_at").single();
    if (error) throw new Error("Task not found or could not be completed."); return { completed: data };
  }
  if (name === "create_note") {
    const { data, error } = await supabase.from("notes").insert({ user_id: userId, title: String(input.title), content: String(input.content), note_type: String(input.note_type || "general"), source_url: input.source_url ? String(input.source_url) : null, is_pinned: false }).select("id,title,note_type,created_at").single();
    if (error) throw new Error(error.message); return { created: data, reminder: "Saved as a note only; no task or project was created." };
  }
  if (name === "find_notes") {
    let query = supabase.from("notes").select("id,title,content,note_type,source_url,is_pinned,created_at,updated_at").eq("user_id", userId).order("updated_at", { ascending: false }).limit(Math.min(Number(input.limit || 10), 25));
    if (input.note_type) query = query.eq("note_type", String(input.note_type));
    if (input.query) { const q = String(input.query).replace(/[,()]/g, " "); query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`); }
    const { data, error } = await query; if (error) throw new Error(error.message); return { notes: data || [] };
  }
  if (name === "update_project") {
    const allowed = ["status", "priority", "progress", "next_action", "blocker", "notes"];
    const update: { status?: string; priority?: string; progress?: number; next_action?: string; blocker?: string; notes?: string } = {}; for (const key of allowed) if (input[key] !== undefined) { if (key === "progress") update.progress = Number(input[key]); else (update as Record<string, string>)[key] = String(input[key]); }
    const { data, error } = await supabase.from("projects").update(update).eq("id", String(input.project_id)).eq("user_id", userId).select("id,name,status,priority,progress,next_action,blocker,notes").single();
    if (error) throw new Error("Project not found or could not be updated."); return { updated: data };
  }
  if (name === "get_today_plan") {
    const today = todayFor(await timezoneFor(supabase, userId)); const { data, error } = await supabase.from("tasks").select("id,title,description,category,priority,status,due_at,project_id,goal_id").eq("user_id", userId).neq("status", "completed").neq("status", "cancelled").gte("due_at", `${today}T00:00:00`).lte("due_at", `${today}T23:59:59.999Z`).order("priority", { ascending: false }).order("due_at", { ascending: true });
    if (error) throw new Error(error.message); return { date: today, main_priority: data?.[0] || null, tasks: data || [] };
  }
  if (name === "get_upcoming_deadlines") return { deadlines: await getUpcomingDeadlines(userId, await timezoneFor(supabase, userId)) };
  if (name === "log_study_session") {
    const { data, error } = await supabase.from("study_sessions").insert({ user_id: userId, module_id: String(input.module_id), duration_minutes: Number(input.duration_minutes), topic: input.topic ? String(input.topic) : null, session_date: input.session_date ? String(input.session_date) : todayFor(await timezoneFor(supabase, userId)), notes: input.notes ? String(input.notes) : null }).select("id,module_id,duration_minutes,topic,session_date").single();
    if (error) throw new Error("Study session could not be logged. Check the module id and duration."); return { logged: data };
  }
  if (name === "generate_weekly_review") {
    const since = isoDaysAgo(7); const [tasks, sessions, notes, deadlines] = await Promise.all([supabase.from("tasks").select("id,title,status,priority,completed_at,due_at").eq("user_id", userId).gte("updated_at", since), supabase.from("study_sessions").select("module_id,duration_minutes,topic,session_date").eq("user_id", userId).gte("created_at", since), supabase.from("notes").select("id,title,note_type,created_at").eq("user_id", userId).gte("created_at", since), getUpcomingDeadlines(userId, await timezoneFor(supabase, userId))
]); return { period: "last 7 days", completed_tasks: (tasks.data || []).filter(t => t.status === "completed"), task_activity: tasks.data || [], study_sessions: sessions.data || [], notes_created: notes.data || [], upcoming_deadlines: deadlines };
  }
  throw new Error(`Unknown assistant tool: ${name}`);
}
