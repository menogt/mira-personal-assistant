"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LogIn } from "lucide-react";

import { loginAction, type AuthActionState } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {
  status: "idle",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.status === "error" ? (
        <p role="alert" className="rounded-md border border-rose-900 bg-rose-950/50 px-3 py-2 text-sm text-rose-200">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
      <div className="text-center">
        <Link href="/forgot-password" className="text-sm text-zinc-400 hover:text-zinc-200">
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}
