import { createClient } from "@/lib/supabase/server";
import type { DailyFocus } from "@/types/database";

export async function getDailyFocus(userId: string, focusDate: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_focus")
    .select("*")
    .eq("user_id", userId)
    .eq("focus_date", focusDate)
    .maybeSingle();

  if (error) {
    console.error("Daily focus query failed", error.message);
    throw new Error("Could not load today's focus.");
  }

  return data as DailyFocus | null;
}
