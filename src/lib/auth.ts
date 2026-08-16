import { redirect } from "next/navigation";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async function getCurrentUser() {
  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error("Supabase is not configured for this deployment", error);
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Failed to read current user", error);
  }


  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/bootstrap");
  }

  return user;
}
