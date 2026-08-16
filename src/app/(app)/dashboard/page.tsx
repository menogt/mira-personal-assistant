import { CalendarDays, CheckSquare2, Flag, Sparkles } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getProfile } from "@/features/profiles/queries";
import { formatReadableDate, greetingFor } from "@/lib/dates";

const emptySections = [
  {
    title: "Today’s tasks",
    description: "Tasks will appear here once the task workspace is wired in.",
    icon: CheckSquare2,
  },
  {
    title: "Today’s university schedule",
    description: "Your module timetable will live here in the University Hub stage.",
    icon: CalendarDays,
  },
  {
    title: "Upcoming deadlines",
    description: "Deadlines from tasks, goals, projects, and modules will surface here.",
    icon: Flag,
  },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getProfile(user);
  const displayName = profile.display_name || "Menaka";

  return (
    <div className="space-y-8">
      <header className="border-b border-zinc-800 pb-7">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-300">{formatReadableDate(new Date(), profile.timezone)}</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              {greetingFor(profile.timezone)}, {displayName}.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400">
              A clean starting point for the day. No manufactured urgency, no suspiciously cheerful productivity theatre.
            </p>
          </div>
          <div className="rounded-full border border-emerald-900/70 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-200">
            Stage 1 foundation
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-emerald-900/60 bg-gradient-to-br from-emerald-950/70 via-zinc-950 to-zinc-950 p-6 shadow-2xl shadow-emerald-950/20 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">Main priority</p>
            <h2 className="mt-3 text-2xl font-semibold text-zinc-50">Nothing selected yet.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              MIRA will help choose one sensible focus after the task, goal, and project data layers are added.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {emptySections.map(({ title, description, icon: Icon }) => (
          <article key={title} className="min-h-48 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <Icon className="h-5 w-5 text-zinc-500" aria-hidden="true" />
            <h2 className="mt-5 text-lg font-semibold text-zinc-100">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">{description}</p>
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">Empty for now</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">Recent progress</p>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Progress notes and daily check-ins will appear here once the related workflows are enabled.
        </p>
      </section>
    </div>
  );
}
