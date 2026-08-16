import { z } from "zod";
export const projectFormSchema = z.object({
  name: z.string().trim().min(1).max(160), description: z.string().max(5000).optional(), status: z.enum(["active","paused","completed","cancelled"]), priority: z.enum(["low","medium","high"]), progress: z.string().regex(/^\d+$/).refine(v => Number(v) <= 100), next_action: z.string().max(1000).optional(), blocker: z.string().max(1000).optional(), github_url: z.string().url().or(z.literal("")).optional(), live_url: z.string().url().or(z.literal("")).optional(), notes: z.string().max(5000).optional(), milestones: z.array(z.object({ id: z.string(), title: z.string().trim().min(1), is_complete: z.boolean(), due_date: z.string().optional() })).optional(), });
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
