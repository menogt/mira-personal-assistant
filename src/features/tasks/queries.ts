import { parseISO } from "date-fns";

import { PRIORITY_WEIGHT, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";
import {
  addDaysToDateKey,
  isIsoBeforeDateKey,
  isIsoBetweenDateKeys,
  isIsoOnDateKey,
  sortIsoAsc,
  todayKey,
} from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/types/database";
import type { TaskFilters } from "@/features/tasks/schemas";

export async function getTasksForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Task query failed", error.message);
    throw new Error("Could not load tasks.");
  }

  return data ?? [];
}

export function filterAndSortTasks(
  tasks: Task[],
  filters: TaskFilters,
  timeZone: string,
) {
  const normalizedSearch = filters.q.trim().toLowerCase();
  const today = todayKey(timeZone);
  const nextSeven = addDaysToDateKey(today, 7);

  const filtered = tasks.filter((task) => {
    if (
      normalizedSearch &&
      !`${task.title} ${task.description ?? ""}`.toLowerCase().includes(normalizedSearch)
    ) {
      return false;
    }

    if (filters.category !== "all" && (TASK_CATEGORIES as readonly string[]).includes(filters.category)) {
      if (task.category !== filters.category) {
        return false;
      }
    }

    if (filters.priority !== "all" && (TASK_PRIORITIES as readonly string[]).includes(filters.priority)) {
      if (task.priority !== filters.priority) {
        return false;
      }
    }

    if (filters.status !== "all" && (TASK_STATUSES as readonly string[]).includes(filters.status)) {
      if (task.status !== filters.status) {
        return false;
      }
    }

    if (filters.due === "today" && !isIsoOnDateKey(task.due_at, today, timeZone)) {
      return false;
    }

    if (filters.due === "overdue" && !isIsoBeforeDateKey(task.due_at, today, timeZone)) {
      return false;
    }

    if (
      filters.due === "next7" &&
      !isIsoBetweenDateKeys(task.due_at, today, nextSeven, timeZone)
    ) {
      return false;
    }

    if (filters.due === "none" && task.due_at) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "priority") {
      return (
        (PRIORITY_WEIGHT[b.priority as keyof typeof PRIORITY_WEIGHT] ?? 0) -
        (PRIORITY_WEIGHT[a.priority as keyof typeof PRIORITY_WEIGHT] ?? 0)
      );
    }

    if (filters.sort === "created") {
      return parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime();
    }

    if (filters.sort === "updated") {
      return parseISO(b.updated_at).getTime() - parseISO(a.updated_at).getTime();
    }

    return sortIsoAsc(a.due_at, b.due_at);
  });
}

export function getIncompleteTasks(tasks: Task[]) {
  return tasks.filter((task) => task.status !== "completed" && task.status !== "cancelled");
}
