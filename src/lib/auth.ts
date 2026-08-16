import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getAllowedEmail } from "@/lib/env";

export async function getCurrentUser() {
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

  const allowedEmail = getAllowedEmail();
  if (user && allowedEmail && user.email?.toLowerCase() !== allowedEmail) {
    await supabase.auth.signOut();
    return null;
  }

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
