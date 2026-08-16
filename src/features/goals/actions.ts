"use server";

import { revalidatePath } from "next/cache";
import { goalFormSchema, type GoalFormValues } from "@/features/goals/schemas";
import { requireUser } from "@/lib/auth";
import type { ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";

function revalidateGoalViews() {
  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/tasks");
}

async function normalize(values: GoalFormValues) {
  const parsed = goalFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors } as const;
  const user = await requireUser();
  return {
    ok: true,
    user,
    payload: {
      name: parsed.data.name,
      category: parsed.data.category,
      reason: parsed.data.reason?.trim() || null,
      deadline: parsed.data.deadline || null,
      progress: Number(parsed.data.progress),
      milestones: parsed.data.milestones ?? [],
      status: parsed.data.status,
    },
  } as const;
}

export async function createGoalAction(values: GoalFormValues): Promise<ActionResult> {
  const normalized = await normalize(values);
  if (!normalized.ok) return { ok: false, message: "Check the goal form.", fieldErrors: normalized.fieldErrors };
  const supabase = await createClient();
  const { error } = await supabase.from("goals").insert({ ...normalized.payload, user_id: normalized.user.id });
  if (error) { console.error("Create goal failed", error.message); return { ok: false, message: "Could not create the goal." }; }
  revalidateGoalViews();
  return { ok: true, message: "Goal created." };
}

export async function updateGoalAction(id: string, values: GoalFormValues): Promise<ActionResult> {
  const normalized = await normalize(values);
  if (!normalized.ok) return { ok: false, message: "Check the goal form.", fieldErrors: normalized.fieldErrors };
  const supabase = await createClient();
  const { error } = await supabase.from("goals").update(normalized.payload).eq("id", id).eq("user_id", normalized.user.id);
  if (error) { console.error("Update goal failed", error.message); return { ok: false, message: "Could not update the goal." }; }
  revalidateGoalViews();
  return { ok: true, message: "Goal updated." };
}

export async function deleteGoalAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
  if (error) { console.error("Delete goal failed", error.message); return { ok: false, message: "Could not delete the goal." }; }
  revalidateGoalViews();
  return { ok: true, message: "Goal deleted." };
}
