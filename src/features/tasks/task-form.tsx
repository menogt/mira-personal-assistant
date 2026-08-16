"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";

import {
  TASK_CATEGORIES,
  TASK_CATEGORY_LABELS,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskCategory,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/constants";
import { dateInputValue, timeInputValue } from "@/lib/dates";
import type { ActionResult } from "@/lib/action-result";
import type { Task } from "@/types/database";
import { taskFormSchema, type TaskFormValues } from "@/features/tasks/schemas";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function TaskForm({
  task,
  timeZone,
  action,
  onSuccessReset = false,
  projects = [],
  goals = [],
}: {
  task?: Task;
  timeZone: string;
  action: (values: TaskFormValues) => Promise<ActionResult>;
  onSuccessReset?: boolean;
  projects?: Array<{ id: string; name: string }>;
  goals?: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const defaultValues = useMemo<TaskFormValues>(
    () => ({
      title: task?.title ?? "",
      description: task?.description ?? "",
      category: safeTaskCategory(task?.category),
      priority: safeTaskPriority(task?.priority),
      status: safeTaskStatus(task?.status),
      due_date: dateInputValue(task?.due_at ?? null, timeZone),
      due_time: timeInputValue(task?.due_at ?? null, timeZone),
      estimated_minutes: task?.estimated_minutes?.toString() ?? "",
      recurrence: task?.recurrence ?? "",
      project_id: task?.project_id ?? "",
      goal_id: task?.goal_id ?? "",
    }),
    [task, timeZone],
  );

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const response = await action(values);
      setResult(response);

      if (response.ok) {
        if (onSuccessReset) {
          form.reset(defaultValues);
        }
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`title-${task?.id ?? "new"}`}>Title</Label>
        <Input id={`title-${task?.id ?? "new"}`} {...form.register("title")} />
        <FieldError message={form.formState.errors.title?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${task?.id ?? "new"}`}>Description</Label>
        <Textarea id={`description-${task?.id ?? "new"}`} {...form.register("description")} />
        <FieldError message={form.formState.errors.description?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!task ? <input type="hidden" {...form.register("status")} /> : null}

        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {TASK_CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={form.formState.errors.category?.message} />
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Controller
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {TASK_PRIORITY_LABELS[priority]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={form.formState.errors.priority?.message} />
        </div>

        {task ? (
          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {TASK_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={form.formState.errors.status?.message} />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor={`estimated-${task?.id ?? "new"}`}>Estimated minutes</Label>
          <Input
            id={`estimated-${task?.id ?? "new"}`}
            inputMode="numeric"
            min={0}
            type="number"
            {...form.register("estimated_minutes")}
          />
          <FieldError message={form.formState.errors.estimated_minutes?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`due-date-${task?.id ?? "new"}`}>Due date</Label>
          <Input id={`due-date-${task?.id ?? "new"}`} type="date" {...form.register("due_date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`due-time-${task?.id ?? "new"}`}>Due time</Label>
          <Input id={`due-time-${task?.id ?? "new"}`} type="time" {...form.register("due_time")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2"><Label htmlFor={`recurrence-${task?.id ?? "new"}`}>Recurrence</Label><Input id={`recurrence-${task?.id ?? "new"}`} placeholder="e.g. weekly" {...form.register("recurrence")} /></div>
        <div className="space-y-2"><Label htmlFor={`project-${task?.id ?? "new"}`}>Project link</Label><select id={`project-${task?.id ?? "new"}`} className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200" {...form.register("project_id")}><option value="">None</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor={`goal-${task?.id ?? "new"}`}>Goal link</Label><select id={`goal-${task?.id ?? "new"}`} className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200" {...form.register("goal_id")}><option value="">None</option>{goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.name}</option>)}</select></div>
      </div>

      {result ? (
        <p
          role="status"
          className={
            result.ok
              ? "rounded-md border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200"
              : "rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-200"
          }
        >
          {result.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        <Save className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Saving..." : task ? "Save task" : "Create task"}
      </Button>
    </form>
  );
}

function safeTaskCategory(value: string | undefined): TaskCategory {
  return TASK_CATEGORIES.includes(value as TaskCategory) ? (value as TaskCategory) : "general";
}

function safeTaskPriority(value: string | undefined): TaskPriority {
  return TASK_PRIORITIES.includes(value as TaskPriority) ? (value as TaskPriority) : "medium";
}

function safeTaskStatus(value: string | undefined): TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus) ? (value as TaskStatus) : "todo";
}
