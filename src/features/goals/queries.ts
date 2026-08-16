import { createClient } from "@/lib/supabase/server";
import type { Goal } from "@/types/database";

export async function getGoalsForUser(userId: string): Promise<Goal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("goals").select("*").eq("user_id", userId).order("updated_at", { ascending: false });
  if (error) { console.error("Goal query failed", error.message); throw new Error("Could not load goals."); }
  return (data ?? []) as Goal[];
}

export type GoalMilestone = { id: string; title: string; completed: boolean };

export function parseMilestones(value: Goal["milestones"]): GoalMilestone[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is GoalMilestone => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Record<string, unknown>;
    return typeof candidate.id === "string" && typeof candidate.title === "string" && typeof candidate.completed === "boolean";
  });
}
