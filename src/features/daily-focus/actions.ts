"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getProfile } from "@/features/profiles/queries";
import { requireUser } from "@/lib/auth";
import type { ActionResult } from "@/lib/action-result";
import { todayKey } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

const focusSchema = z
  .object({
    task_id: z.string().uuid().optional().or(z.literal("")),
    custom_text: z.string().trim().optional(),
  })
  .refine(
    (value) => Boolean(value.task_id) || Boolean(value.custom_text && value.custom_text.length > 0),
    "Choose a task or enter custom focus text.",
  );

export async function setDailyFocusAction(
  _previousState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = focusSchema.safeParse({
    task_id: formData.get("task_id"),
    custom_text: formData.get("custom_text"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the focus form." };
  }

  const user = await requireUser();
  const profile = await getProfile(user);
  const supabase = await createClient();
  const { error } = await supabase.from("daily_focus").upsert(
    {
      user_id: user.id,
      focus_date: todayKey(profile.timezone),
      task_id: parsed.data.task_id || null,
      custom_text: parsed.data.custom_text?.trim() || null,
    },
    { onConflict: "user_id,focus_date" },
  );

  if (error) {
    console.error("Set daily focus failed", error.message);
    return { ok: false, message: "Could not save today's focus." };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "Today's focus saved." };
}
