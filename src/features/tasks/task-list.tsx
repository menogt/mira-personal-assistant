import { Pencil } from "lucide-react";

import { updateTaskAction } from "@/features/tasks/actions";
import { TaskForm } from "@/features/tasks/task-form";
import {
  TASK_CATEGORY_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "@/lib/constants";
import { formatDateOnly, formatDateTime, hasExplicitTime } from "@/lib/dates";
import type { Task } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { DeleteTaskButton, TaskCompletionButton } from "@/features/tasks/task-actions";

export function TaskList({ tasks, timeZone }: { tasks: Task[]; timeZone: string }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-md border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">
        No tasks match the current view.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <article key={task.id} className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-3">
              <div>
                <h2 className="break-words text-lg font-semibold text-zinc-50">{task.title}</h2>
                {task.description ? (
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-400">
                    {task.description}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{TASK_CATEGORY_LABELS[task.category as keyof typeof TASK_CATEGORY_LABELS]}</Badge>
                <Badge>{TASK_PRIORITY_LABELS[task.priority as keyof typeof TASK_PRIORITY_LABELS]}</Badge>
                <Badge>{TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}</Badge>
                <Badge>
                  {hasExplicitTime(task.due_at, timeZone)
                    ? formatDateTime(task.due_at, timeZone)
                    : formatDateOnly(task.due_at, timeZone)}
                </Badge>
                {task.estimated_minutes ? <Badge>{task.estimated_minutes} min</Badge> : null}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <TaskCompletionButton id={task.id} completed={task.status === "completed"} />
              <DeleteTaskButton id={task.id} title={task.title} />
            </div>
          </div>
          <details className="mt-4 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit task
            </summary>
            <div className="mt-4">
              <TaskForm
                task={task}
                timeZone={timeZone}
                action={updateTaskAction.bind(null, task.id)}
              />
            </div>
          </details>
        </article>
      ))}
    </div>
  );
}
