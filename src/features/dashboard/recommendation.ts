import { parseISO } from "date-fns";

import {
  isIsoBeforeDateKey,
  isIsoOnDateKey,
  todayKey,
} from "@/lib/dates";
import type { Task } from "@/types/database";

export function getFocusRecommendation(tasks: Task[], timeZone: string) {
  const today = todayKey(timeZone);
  const incomplete = tasks
    .filter((task) => task.status !== "completed" && task.status !== "cancelled")
    .sort((a, b) => dueSort(a, b));

  return (
    incomplete.find(
      (task) => task.priority === "urgent" && isIsoBeforeDateKey(task.due_at, today, timeZone),
    ) ??
    incomplete.find(
      (task) => task.priority === "high" && isIsoBeforeDateKey(task.due_at, today, timeZone),
    ) ??
    incomplete.find(
      (task) => task.priority === "urgent" && isIsoOnDateKey(task.due_at, today, timeZone),
    ) ??
    incomplete.find(
      (task) => task.priority === "high" && isIsoOnDateKey(task.due_at, today, timeZone),
    ) ??
    incomplete.find((task) => task.due_at && parseISO(task.due_at).getTime() >= Date.now()) ??
    null
  );
}

function dueSort(a: Task, b: Task) {
  if (!a.due_at && !b.due_at) {
    return 0;
  }

  if (!a.due_at) {
    return 1;
  }

  if (!b.due_at) {
    return -1;
  }

  return parseISO(a.due_at).getTime() - parseISO(b.due_at).getTime();
}
