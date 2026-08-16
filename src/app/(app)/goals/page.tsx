import { PageHeader } from "@/components/app/page-header";
import { requireUser } from "@/lib/auth";
import { getGoalsForUser } from "@/features/goals/queries";
import { createGoalAction } from "@/features/goals/actions";
import { GoalForm } from "@/features/goals/goal-form";
import { GoalList } from "@/features/goals/goal-list";

export default async function GoalsPage() {
  const user = await requireUser();
  const goals = await getGoalsForUser(user.id);
  return <><PageHeader title="Goals" description="Track outcomes separately from the tasks that support them." /><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]"><section><GoalList goals={goals} /></section><aside className="rounded-md border border-zinc-800 bg-zinc-950 p-4 xl:sticky xl:top-6 xl:self-start"><h2 className="mb-4 text-lg font-semibold text-zinc-50">Create goal</h2><GoalForm action={createGoalAction} onSuccessReset /></aside></div></>;
}
