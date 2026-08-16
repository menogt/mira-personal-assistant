import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getAllowedEmail } from "@/lib/env";

export async function getCurrentUser() {
  const supabase = await createClient();
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
