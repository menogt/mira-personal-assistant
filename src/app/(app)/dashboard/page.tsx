import { DashboardPanels } from "@/features/dashboard/dashboard-panels";
import { getFocusRecommendation } from "@/features/dashboard/recommendation";
import { getDailyFocus } from "@/features/daily-focus/queries";
import { getRecentNotesForDashboard } from "@/features/notes/queries";
import { getProfile } from "@/features/profiles/queries";
import { getTasksForUser } from "@/features/tasks/queries";
import { requireUser } from "@/lib/auth";
import { todayKey } from "@/lib/dates";

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getProfile(user);
  const [tasks, notes, dailyFocus] = await Promise.all([
    getTasksForUser(user.id),
    getRecentNotesForDashboard(user.id),
    getDailyFocus(user.id, todayKey(profile.timezone)),
  ]);
  const recommendation = dailyFocus ? null : getFocusRecommendation(tasks, profile.timezone);

  return (
    <DashboardPanels
      profile={profile}
      tasks={tasks}
      notes={notes}
      dailyFocus={dailyFocus}
      recommendation={recommendation}
    />
  );
}
