"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (error) throw error;
      setStatus("sent");
      setMessage("If that email belongs to MIRA, a recovery link is on its way. Check your inbox and spam folder.");
    } catch (error) {
      console.error("Password reset request failed", error);
      setStatus("error");
      setMessage("We could not send the recovery email. Check the email address and try again.");
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-md border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">MIRA</p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-50">Reset your password</h1>
          <p className="mt-2 text-sm text-zinc-400">MIRA will email a secure link if the address belongs to this private instance.</p>
        </div>

        {status === "sent" ? (
          <div className="space-y-5">
            <p role="status" className="rounded-md border border-emerald-900 bg-emerald-950/50 px-3 py-3 text-sm text-emerald-200">{message}</p>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input id="reset-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </div>
            {status === "error" ? <p role="alert" className="rounded-md border border-rose-900 bg-rose-950/50 px-3 py-2 text-sm text-rose-200">{message}</p> : null}
            <Button type="submit" className="w-full" disabled={status === "sending"}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              {status === "sending" ? "Sending link..." : "Email me a reset link"}
            </Button>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to sign in
            </Link>
          </form>
        )}
      </section>
    </main>
  );
}
