"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalForm } from "@/features/goals/goal-form";
import { deleteGoalAction, updateGoalAction } from "@/features/goals/actions";
import { parseMilestones } from "@/features/goals/utils";
import type { Goal } from "@/types/database";

export function GoalList({ goals }: { goals: Goal[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (!goals.length) return <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 p-8"><p className="text-lg font-medium text-zinc-200">No goals yet.</p><p className="mt-2 text-sm text-zinc-500">Choose a few outcomes worth tracking. The app will not applaud every minor administrative event.</p></div>;

  return <div className="space-y-4">{message ? <p className="text-sm text-zinc-400" role="status">{message}</p> : null}{goals.map((goal) => {
    const milestones = parseMilestones(goal.milestones);
    return <article key={goal.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      {editingId === goal.id ? <GoalForm goal={goal} action={(values) => updateGoalAction(goal.id, values)} /> : <>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold text-zinc-100">{goal.name}</h2><span className="rounded-full bg-emerald-950 px-2.5 py-1 text-xs text-emerald-200">{goal.status}</span><span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400">{goal.category}</span></div>{goal.reason ? <p className="mt-2 text-sm leading-6 text-zinc-400">{goal.reason}</p> : null}</div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setEditingId(goal.id)}><Pencil className="h-4 w-4" />Edit</Button><Button variant="ghost" size="sm" disabled={isPending} onClick={() => startTransition(async () => { const result = await deleteGoalAction(goal.id); setMessage(result.message); })}><Trash2 className="h-4 w-4" />Delete</Button></div></div>
        <div className="mt-5"><div className="flex justify-between text-xs text-zinc-500"><span>Progress</span><span>{goal.progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-400 transition-[width]" style={{ width: `${goal.progress}%` }} /></div></div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500"><span>{goal.deadline ? `Due ${goal.deadline}` : "No deadline"}</span><span>{milestones.filter((m) => m.completed).length}/{milestones.length} milestones complete</span></div>
        {milestones.length ? <ul className="mt-4 space-y-2 text-sm text-zinc-300">{milestones.map((milestone) => <li key={milestone.id} className={milestone.completed ? "text-zinc-500 line-through" : ""}> {milestone.completed ? "✓" : "○"} {milestone.title}</li>)}</ul> : null}
      </>}
    </article>;
  })}</div>;
}
