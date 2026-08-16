"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "saving" | "success" | "error">("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function checkSession() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error || !data.session) {
          setStatus("error");
          setMessage("This recovery link is missing or has expired. Request a new link from the login page.");
          return;
        }
        setStatus("ready");
      } catch (error) {
        console.error("Recovery session check failed", error);
        if (active) {
          setStatus("error");
          setMessage("We could not validate this recovery link. Request a new one and try again.");
        }
      }
    }
    void checkSession();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setMessage("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setStatus("error");
      setMessage("The passwords do not match.");
      return;
    }

    setStatus("saving");
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
      setStatus("success");
      setMessage("Your password was updated. You can now sign in with the new password.");
    } catch (error) {
      console.error("Password update failed", error);
      setStatus("error");
      setMessage("We could not update the password. Request a fresh recovery link and try again.");
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-md border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">MIRA</p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-50">Choose a new password</h1>
          <p className="mt-2 text-sm text-zinc-400">This changes your Supabase Auth password only. Your MIRA data stays untouched.</p>
        </div>

        {status === "success" ? (
          <div className="space-y-5">
            <p role="status" className="rounded-md border border-emerald-900 bg-emerald-950/50 px-3 py-3 text-sm text-emerald-200">{message}</p>
            <Link href="/login" className="text-sm text-zinc-300 hover:text-white">Return to sign in</Link>
          </div>
        ) : status === "error" ? (
          <div className="space-y-5">
            <p role="alert" className="rounded-md border border-rose-900 bg-rose-950/50 px-3 py-3 text-sm text-rose-200">{message}</p>
            <Link href="/forgot-password" className="text-sm text-zinc-300 hover:text-white">Request another recovery link</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} disabled={status !== "ready"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={status !== "ready"} />
            </div>
            <Button type="submit" className="w-full" disabled={status !== "ready"}>
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              {status === "checking" ? "Validating link..." : status === "saving" ? "Updating password..." : "Set new password"}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
