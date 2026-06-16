import type { User } from "@supabase/supabase-js";

import type { Profile } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

export async function getProfile(user: User): Promise<Profile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!error && data) {
    return data;
  }

  console.error("Profile read failed; creating fallback profile", error?.message);

  const fallbackDisplayName =
    user.user_metadata?.display_name ??
    user.email?.split("@")[0] ??
    "Menaka";

  const { data: upserted, error: upsertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email,
        display_name: fallbackDisplayName,
        timezone: "Asia/Colombo",
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (upsertError || !upserted) {
    console.error("Profile fallback creation failed", upsertError?.message);
    throw new Error("Could not load your profile.");
  }

  return upserted;
}
