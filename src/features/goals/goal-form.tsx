"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";
import type { Goal } from "@/types/database";
import { GOAL_CATEGORIES, GOAL_CATEGORY_LABELS, goalFormSchema, type GoalFormValues } from "@/features/goals/schemas";
import { parseMilestones } from "@/features/goals/utils";

export function GoalForm({ goal, action, onSuccessReset = false }: { goal?: Goal; action: (values: GoalFormValues) => Promise<ActionResult>; onSuccessReset?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const defaultValues = useMemo<GoalFormValues>(() => ({
    name: goal?.name ?? "",
    category: GOAL_CATEGORIES.includes(goal?.category as (typeof GOAL_CATEGORIES)[number]) ? goal!.category : "personal",
    reason: goal?.reason ?? "",
    deadline: goal?.deadline ?? "",
    progress: goal?.progress?.toString() ?? "0",
    milestones: parseMilestones(goal?.milestones ?? []).map((m) => ({ ...m })),
    status: (goal?.status as GoalFormValues["status"]) ?? "active",
  }), [goal]);
  const form = useForm<GoalFormValues>({ resolver: zodResolver(goalFormSchema), defaultValues });
  const milestones = form.watch("milestones") ?? [];

  const submit = form.handleSubmit((values) => startTransition(async () => {
    const response = await action(values);
    setResult(response);
    if (response.ok) { if (onSuccessReset) form.reset(defaultValues); router.refresh(); }
  }));

  function addMilestone() {
    form.setValue("milestones", [...milestones, { id: crypto.randomUUID(), title: "", completed: false }], { shouldDirty: true });
  }
  function removeMilestone(id: string) { form.setValue("milestones", milestones.filter((m) => m.id !== id), { shouldDirty: true }); }

  return <form onSubmit={submit} className="space-y-4">
    <div className="space-y-2"><Label htmlFor={`goal-name-${goal?.id ?? "new"}`}>Name</Label><Input id={`goal-name-${goal?.id ?? "new"}`} {...form.register("name")} /><FieldError message={form.formState.errors.name?.message} /></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2"><Label>Category</Label><Controller control={form.control} name="category" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{GOAL_CATEGORIES.map((category) => <SelectItem key={category} value={category}>{GOAL_CATEGORY_LABELS[category]}</SelectItem>)}</SelectContent></Select>} /></div>
      <div className="space-y-2"><Label>Status</Label><Controller control={form.control} name="status" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["active", "paused", "completed", "cancelled"].map((status) => <SelectItem key={status} value={status}>{status.replace("_", " ")}</SelectItem>)}</SelectContent></Select>} /></div>
    </div>
    <div className="space-y-2"><Label htmlFor={`goal-reason-${goal?.id ?? "new"}`}>Why it matters</Label><Textarea id={`goal-reason-${goal?.id ?? "new"}`} {...form.register("reason")} /></div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor={`goal-deadline-${goal?.id ?? "new"}`}>Deadline</Label><Input id={`goal-deadline-${goal?.id ?? "new"}`} type="date" {...form.register("deadline")} /></div><div className="space-y-2"><Label htmlFor={`goal-progress-${goal?.id ?? "new"}`}>Progress (%)</Label><Input id={`goal-progress-${goal?.id ?? "new"}`} type="number" min={0} max={100} {...form.register("progress")} /></div></div>
    <div className="space-y-3"><div className="flex items-center justify-between"><Label>Milestones</Label><Button type="button" variant="outline" size="sm" onClick={addMilestone}><Plus className="h-4 w-4" />Add</Button></div>{milestones.length === 0 ? <p className="text-sm text-zinc-500">No milestones yet. A goal without checkpoints is just a wish with better typography.</p> : milestones.map((milestone, index) => <div key={milestone.id} className="flex items-center gap-2"><input type="checkbox" aria-label={`Complete milestone ${index + 1}`} checked={milestone.completed} onChange={(event) => form.setValue(`milestones.${index}.completed`, event.target.checked, { shouldDirty: true })} /><Input aria-label={`Milestone ${index + 1}`} {...form.register(`milestones.${index}.title`)} /><Button type="button" variant="ghost" size="icon" onClick={() => removeMilestone(milestone.id)} aria-label="Remove milestone"><Trash2 className="h-4 w-4" /></Button></div>)}</div>
    {result ? <p role="status" className={result.ok ? "rounded-md border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200" : "rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-200"}>{result.message}</p> : null}
    <Button type="submit" disabled={isPending}><Save className="h-4 w-4" />{isPending ? "Saving..." : goal ? "Save goal" : "Create goal"}</Button>
  </form>;
}
