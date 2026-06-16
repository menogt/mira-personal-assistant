import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-md border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">MIRA</p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-50">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Private access for Menaka&apos;s Intelligent Routine Assistant.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
