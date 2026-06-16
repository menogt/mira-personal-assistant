"use client";

import { useActionState } from "react";
import { Target } from "lucide-react";

import { setDailyFocusAction } from "@/features/daily-focus/actions";
import type { ActionResult } from "@/lib/action-result";
import type { DailyFocus, Task } from "@/types/database";
import { Button } from "@/components/ui/button";

const initialState: ActionResult | null = null;

export function FocusForm({
  tasks,
  currentFocus,
}: {
  tasks: Task[];
  currentFocus: DailyFocus | null;
}) {
  const [state, formAction, isPending] = useActionState(setDailyFocusAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <label className="space-y-2">
        <span className="text-sm font-medium text-zinc-200">Focus task</span>
        <select
          name="task_id"
          defaultValue={currentFocus?.task_id ?? ""}
          className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          <option value="">No selected task</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-zinc-200">Custom focus</span>
        <input
          name="custom_text"
          defaultValue={currentFocus?.custom_text ?? ""}
          className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          placeholder="One clear thing for today"
        />
      </label>
      {state ? (
        <p
          role="status"
          className={
            state.ok
              ? "rounded-md border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200"
              : "rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-200"
          }
        >
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={isPending}>
        <Target className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Saving..." : "Save focus"}
      </Button>
    </form>
  );
}
