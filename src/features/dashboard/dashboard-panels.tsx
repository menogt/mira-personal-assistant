import Link from "next/link";

import { FocusForm } from "@/features/dashboard/focus-form";
import { TaskCompletionButton } from "@/features/tasks/task-actions";
import {
  NOTE_TYPE_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "@/lib/constants";
import {
  addDaysToDateKey,
  formatDateOnly,
  formatDateTime,
  formatReadableDate,
  greetingFor,
  hasExplicitTime,
  isIsoBetweenDateKeys,
  isIsoOnDateKey,
  sortIsoAsc,
  todayKey,
} from "@/lib/dates";
import type { DailyFocus, Note, Profile, Task } from "@/types/database";
import { Badge } from "@/components/ui/badge";

export function DashboardPanels({
  profile,
  tasks,
  notes,
  dailyFocus,
  recommendation,
}: {
  profile: Profile;
  tasks: Task[];
  notes: Note[];
  dailyFocus: DailyFocus | null;
  recommendation: Task | null;
}) {
  const today = todayKey(profile.timezone);
  const nextSeven = addDaysToDateKey(today, 7);
  const displayName = profile.display_name || "Menaka";
  const todayTasks = tasks
    .filter((task) => isIsoOnDateKey(task.due_at, today, profile.timezone))
    .sort((a, b) => sortIsoAsc(a.due_at, b.due_at));
  const todayIncomplete = todayTasks.filter(
    (task) => task.status !== "completed" && task.status !== "cancelled",
  );
  const todayCompleted = todayTasks.filter((task) => task.status === "completed");
  const completionPercentage =
    todayTasks.length === 0 ? 0 : Math.round((todayCompleted.length / todayTasks.length) * 100);
  const schedule = todayTasks
    .filter((task) => hasExplicitTime(task.due_at, profile.timezone))
    .sort((a, b) => sortIsoAsc(a.due_at, b.due_at));
  const upcoming = tasks
    .filter(
      (task) =>
        task.status !== "completed" &&
        task.status !== "cancelled" &&
        isIsoBetweenDateKeys(task.due_at, today, nextSeven, profile.timezone) &&
        !isIsoOnDateKey(task.due_at, today, profile.timezone),
    )
    .sort((a, b) => sortIsoAsc(a.due_at, b.due_at));
  const focusTask = dailyFocus?.task_id
    ? tasks.find((task) => task.id === dailyFocus.task_id) ?? null
    : null;
  const focusText = dailyFocus?.custom_text || focusTask?.title || null;

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-zinc-800 bg-zinc-950 p-5">
        <p className="text-sm text-emerald-300">{formatReadableDate(new Date(), profile.timezone)}</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-50 sm:text-3xl">
          {greetingFor(profile.timezone)}, {displayName}
        </h1>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          <section className="rounded-md border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Main focus</p>
                {focusText ? (
                  <h2 className="mt-2 break-words text-2xl font-semibold text-zinc-50">
                    {focusText}
                  </h2>
                ) : recommendation ? (
                  <h2 className="mt-2 break-words text-2xl font-semibold text-zinc-50">
                    {recommendation.title}
                  </h2>
                ) : (
                  <h2 className="mt-2 text-2xl font-semibold text-zinc-50">No recommendation</h2>
                )}
                {!focusText && recommendation ? (
                  <p className="mt-2 text-sm text-zinc-400">
                    Recommended from overdue, urgent, high-priority, and upcoming tasks.
                  </p>
                ) : null}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Metric label="Due today" value={todayTasks.length} />
                <Metric label="Done" value={todayCompleted.length} />
                <Metric label="Progress" value={`${completionPercentage}%`} />
              </div>
            </div>
          </section>

          <DashboardSection title="Today's tasks">
            {todayTasks.length === 0 ? (
              <EmptyState text="No tasks due today." />
            ) : (
              <div className="space-y-3">
                {[...todayIncomplete, ...todayCompleted].map((task) => (
                  <TaskRow key={task.id} task={task} timeZone={profile.timezone} />
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="Today's schedule">
            {schedule.length === 0 ? (
              <EmptyState text="No timed tasks for today." />
            ) : (
              <div className="space-y-3">
                {schedule.map((task) => (
                  <TaskRow key={task.id} task={task} timeZone={profile.timezone} compact />
                ))}
              </div>
            )}
          </DashboardSection>
        </div>

        <aside className="space-y-6">
          <section className="rounded-md border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-lg font-semibold text-zinc-50">Select focus</h2>
            <div className="mt-4">
              <FocusForm tasks={tasks.filter((task) => task.status !== "completed")} currentFocus={dailyFocus} />
            </div>
          </section>

          <DashboardSection title="Upcoming tasks">
            {upcoming.length === 0 ? (
              <EmptyState text="No upcoming incomplete tasks in the next seven days." />
            ) : (
              <div className="space-y-3">
                {upcoming.slice(0, 7).map((task) => (
                  <TaskRow key={task.id} task={task} timeZone={profile.timezone} compact />
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="Recent notes">
            {notes.length === 0 ? (
              <EmptyState text="No notes yet." />
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <Link
                    key={note.id}
                    href="/notes"
                    className="block rounded-md border border-zinc-800 bg-zinc-900/40 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                  >
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-100">
                        {note.title}
                      </p>
                      {note.is_pinned ? <Badge className="border-emerald-800 text-emerald-200">Pinned</Badge> : null}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{note.content}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {NOTE_TYPE_LABELS[note.note_type as keyof typeof NOTE_TYPE_LABELS]}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </DashboardSection>
        </aside>
      </div>
    </div>
  );
}

function DashboardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-zinc-800 bg-zinc-950 p-5">
      <h2 className="mb-4 text-lg font-semibold text-zinc-50">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="min-w-20 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2">
      <p className="text-lg font-semibold text-zinc-50">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function TaskRow({
  task,
  timeZone,
  compact = false,
}: {
  task: Task;
  timeZone: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-medium text-zinc-100">{task.title}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{TASK_PRIORITY_LABELS[task.priority as keyof typeof TASK_PRIORITY_LABELS]}</Badge>
            <Badge>{TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}</Badge>
            <Badge>
              {hasExplicitTime(task.due_at, timeZone)
                ? formatDateTime(task.due_at, timeZone)
                : formatDateOnly(task.due_at, timeZone)}
            </Badge>
          </div>
        </div>
        {!compact ? (
          <TaskCompletionButton id={task.id} completed={task.status === "completed"} />
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-md border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400">{text}</p>;
}
