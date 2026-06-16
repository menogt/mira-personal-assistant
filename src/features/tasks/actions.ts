"use server";

import { revalidatePath } from "next/cache";

import { taskFormSchema, type TaskFormValues } from "@/features/tasks/schemas";
import { getProfile } from "@/features/profiles/queries";
import { requireUser } from "@/lib/auth";
import { zonedDateTimeToUtcIso } from "@/lib/dates";
import type { ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";

function revalidateTaskViews() {
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

type TaskPayload = {
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  due_at: string | null;
  estimated_minutes: number | null;
  completed_at: string | null;
};

async function normalizeTaskInput(values: TaskFormValues) {
  const parsed = taskFormSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors } as const;
  }

  const user = await requireUser();
  const profile = await getProfile(user);
  const dueAt = parsed.data.due_date
    ? zonedDateTimeToUtcIso(parsed.data.due_date, parsed.data.due_time, profile.timezone)
    : null;
  const estimatedMinutes = parsed.data.estimated_minutes
    ? Number(parsed.data.estimated_minutes)
    : null;
  const payload: TaskPayload = {
    title: parsed.data.title,
    description: parsed.data.description?.trim() || null,
    category: parsed.data.category,
    priority: parsed.data.priority,
    status: parsed.data.status,
    due_at: dueAt,
    estimated_minutes: estimatedMinutes,
    completed_at: parsed.data.status === "completed" ? new Date().toISOString() : null,
  };

  return {
    ok: true,
    user,
    payload,
  } as const;
}

export async function createTaskAction(values: TaskFormValues): Promise<ActionResult> {
  const normalized = await normalizeTaskInput(values);

  if (!normalized.ok) {
    return {
      ok: false,
      message: "Check the task form.",
      fieldErrors: normalized.fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    ...normalized.payload,
    user_id: normalized.user.id,
  });

  if (error) {
    console.error("Create task failed", error.message);
    return { ok: false, message: "Could not create the task." };
  }

  revalidateTaskViews();
  return { ok: true, message: "Task created." };
}

export async function updateTaskAction(
  id: string,
  values: TaskFormValues,
): Promise<ActionResult> {
  const normalized = await normalizeTaskInput(values);

  if (!normalized.ok) {
    return {
      ok: false,
      message: "Check the task form.",
      fieldErrors: normalized.fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update(normalized.payload)
    .eq("id", id)
    .eq("user_id", normalized.user.id);

  if (error) {
    console.error("Update task failed", error.message);
    return { ok: false, message: "Could not update the task." };
  }

  revalidateTaskViews();
  return { ok: true, message: "Task updated." };
}

export async function deleteTaskAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    console.error("Delete task failed", error.message);
    return { ok: false, message: "Could not delete the task." };
  }

  revalidateTaskViews();
  return { ok: true, message: "Task deleted." };
}

export async function setTaskCompletionAction(
  id: string,
  completed: boolean,
): Promise<ActionResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({
      status: completed ? "completed" : "todo",
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Update task completion failed", error.message);
    return { ok: false, message: "Could not update task status." };
  }

  revalidateTaskViews();
  return { ok: true, message: completed ? "Task completed." : "Task reopened." };
}
