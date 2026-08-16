"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/browser";

export function BootstrapClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const start = async () => {
      try {
        const supabase = createClient();
        const { data: existing } = await supabase.auth.getSession();
        if (!active) return;
        if (existing.session) {
          router.replace("/dashboard");
          return;
        }

        const { error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) throw signInError;
        router.replace("/dashboard");
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not start MIRA.");
      }
    };
    void start();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-md border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/30">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">MIRA</p>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-50">Opening your workspace</h1>
        <p className="mt-2 text-sm text-zinc-400">No password ritual. Just getting to the actual app.</p>
        {error ? (
          <div className="mt-6 rounded-md border border-red-900/70 bg-red-950/30 p-4 text-sm text-red-200">
            <p>Automatic access could not start.</p>
            <p className="mt-2 break-words text-red-300">{error}</p>
            <p className="mt-3 text-red-200/80">In Supabase, enable Authentication → Providers → Anonymous sign-ins, then reload this page.</p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-zinc-500">Starting a private anonymous session…</p>
        )}
      </section>
    </main>
  );
}
