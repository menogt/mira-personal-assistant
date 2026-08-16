"use server";

import { redirect } from "next/navigation";

import { loginSchema } from "@/features/auth/schemas";
import { createClient } from "@/lib/supabase/server";
import { getAllowedEmail } from "@/lib/env";

export type AuthActionState = {
  status: "idle" | "error";
  message?: string;
};

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check your login details.",
    };
  }

  const allowedEmail = getAllowedEmail();
  if (allowedEmail && parsed.data.email.toLowerCase() !== allowedEmail) {
    return {
      status: "error",
      message: "This MIRA instance is private and the email is not allowed.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    console.error("Login failed", error.message);
    return {
      status: "error",
      message: "Could not sign in with those credentials.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed", error.message);
  }

  redirect("/login");
}
