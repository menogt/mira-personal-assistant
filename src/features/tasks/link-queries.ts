import { createClient } from "@/lib/supabase/server";

export async function getTaskLinkOptions(userId: string) {
  const supabase = await createClient();
  const [{ data: projects, error: projectsError }, { data: goals, error: goalsError }] = await Promise.all([
    supabase.from("projects").select("id, name").eq("user_id", userId).order("name"),
    supabase.from("goals").select("id, name").eq("user_id", userId).order("name"),
  ]);
  if (projectsError || goalsError) {
    console.error("Task link options query failed", projectsError?.message ?? goalsError?.message);
    return { projects: [], goals: [] };
  }
  return { projects: projects ?? [], goals: goals ?? [] };
}
