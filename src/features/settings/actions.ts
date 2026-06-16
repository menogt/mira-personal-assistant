"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { TIMEZONES } from "@/lib/constants";
import { requireUser } from "@/lib/auth";
import type { ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";

const settingsSchema = z.object({
  display_name: z.string().trim().min(1, "Display name is required.").max(80),
  timezone: z.enum(TIMEZONES, { error: "Choose a supported timezone." }),
});

export type SettingsInput = z.input<typeof settingsSchema>;

export async function updateSettingsAction(values: SettingsInput): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the settings form.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name,
      timezone: parsed.data.timezone,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Update settings failed", error.message);
    return { ok: false, message: "Could not update settings." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { ok: true, message: "Settings updated." };
}
