import type { Goal } from "@/types/database";

export type GoalMilestone = { id: string; title: string; completed: boolean };

export function parseMilestones(value: Goal["milestones"]): GoalMilestone[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is GoalMilestone => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Record<string, unknown>;
    return typeof candidate.id === "string" && typeof candidate.title === "string" && typeof candidate.completed === "boolean";
  });
}
