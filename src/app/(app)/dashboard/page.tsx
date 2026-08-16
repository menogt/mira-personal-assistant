import { CalendarDays, CheckSquare2, Flag, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getProfile } from "@/features/profiles/queries";
import { getTodayTasks } from "@/features/tasks/queries";
import { TaskCompletionButton } from "@/features/tasks/task-actions";
import { formatReadableDate, greetingFor, formatDateTime, formatDateOnly, hasExplicitTime } from "@/lib/dates";
import { TASK_PRIORITY_LABELS } from "@/lib/constants";

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getProfile(user);
  const displayName = profile.display_name || "Menaka";
  const todayTasks = await getTodayTasks(user.id, profile.timezone);
  const mainPriority = todayTasks[0];

  return <div className="space-y-8">
    <header className="border-b border-zinc-800 pb-7"><p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-300">{formatReadableDate(new Date(), profile.timezone)}</p><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">{greetingFor(profile.timezone)}, {displayName}.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400">A short briefing for the day. It now includes the work you actually put into MIRA, rather than a decorative promise to do so.</p></div><div className="rounded-full border border-emerald-900/70 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-200">Tasks + Goals</div></div></header>
    <section className="rounded-2xl border border-emerald-900/60 bg-gradient-to-br from-emerald-950/70 via-zinc-950 to-zinc-950 p-6 shadow-2xl shadow-emerald-950/20 sm:p-8"><div className="flex items-start gap-4"><div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300"><Sparkles className="h-5 w-5" /></div><div><p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">Main priority</p><h2 className="mt-3 text-2xl font-semibold text-zinc-50">{mainPriority?.title ?? "Nothing selected yet."}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">{mainPriority ? `${TASK_PRIORITY_LABELS[mainPriority.priority as keyof typeof TASK_PRIORITY_LABELS] ?? "Today"} priority. Finish this before collecting more ambitions.` : "Add a task due today to give MIRA something concrete to brief you about."}</p></div></div></section>
    <section className="grid gap-5 lg:grid-cols-3">
      <article className="min-h-48 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-2"><div className="flex items-center justify-between"><div><CheckSquare2 className="h-5 w-5 text-emerald-300" /><h2 className="mt-5 text-lg font-semibold text-zinc-100">Today’s tasks</h2></div><span className="text-sm text-zinc-500">{todayTasks.length} open</span></div>{todayTasks.length ? <div className="mt-5 space-y-2">{todayTasks.map((task) => <div key={task.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-zinc-100">{task.title}</p><p className="mt-1 text-xs text-zinc-500">{task.due_at ? (hasExplicitTime(task.due_at, profile.timezone) ? formatDateTime(task.due_at, profile.timezone) : formatDateOnly(task.due_at, profile.timezone)) : "No time set"}</p></div><TaskCompletionButton id={task.id} completed={false} /></div>)}</div> : <p className="mt-5 text-sm leading-6 text-zinc-500">No open tasks due today. Either you are ahead or today has not been planned. Both are acceptable.</p>}</article>
      <article className="min-h-48 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"><CalendarDays className="h-5 w-5 text-zinc-500" /><h2 className="mt-5 text-lg font-semibold text-zinc-100">Today’s university schedule</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Your module timetable will appear here in the University Hub stage.</p><p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">Coming next</p></article>
    </section>
    <section className="grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"><Flag className="h-5 w-5 text-zinc-500" /><h2 className="mt-5 text-lg font-semibold text-zinc-100">Upcoming deadlines</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Goal and module deadlines will join the task view in a later stage.</p></article><article className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 p-6"><p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">Recent progress</p><p className="mt-3 text-sm leading-6 text-zinc-400">Completion history and daily check-ins will appear here once those workflows are enabled.</p></article></section>
  </div>;
}
