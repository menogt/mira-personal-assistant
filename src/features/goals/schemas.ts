import { z } from "zod";

export const milestoneSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(160),
  completed: z.boolean(),
});

export const goalFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(160),
  category: z.string().trim().min(1, "Choose a category.").max(60),
  reason: z.string().max(5000).optional(),
  deadline: z.string().optional(),
  progress: z.string().regex(/^\d+$/, "Enter a whole percentage.").refine((value) => Number(value) <= 100, "Progress cannot exceed 100."),
  milestones: z.array(milestoneSchema).optional(),
  status: z.enum(["active", "paused", "completed", "cancelled"]),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

export const GOAL_CATEGORIES = ["career", "university", "health", "finance", "personal", "creative"] as const;
export const GOAL_CATEGORY_LABELS: Record<(typeof GOAL_CATEGORIES)[number], string> = {
  career: "Career",
  university: "University",
  health: "Health",
  finance: "Finance",
  personal: "Personal",
  creative: "Creative",
};
