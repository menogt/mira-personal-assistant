import { z } from "zod";

import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160, "Keep the title shorter."),
  description: z.string().max(5000, "Description is too long.").optional(),
  category: z.enum(TASK_CATEGORIES, { error: "Choose a category." }),
  priority: z.enum(TASK_PRIORITIES, { error: "Choose a priority." }),
  status: z.enum(TASK_STATUSES, { error: "Choose a status." }),
  due_date: z.string().optional(),
  due_time: z.string().optional(),
  estimated_minutes: z
    .string()
    .optional()
    .refine((value) => !value || Number.isInteger(Number(value)), "Enter whole minutes.")
    .refine((value) => !value || Number(value) >= 0, "Duration cannot be negative."),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const taskFiltersSchema = z.object({
  q: z.string().optional().default(""),
  category: z.string().optional().default("all"),
  priority: z.string().optional().default("all"),
  status: z.string().optional().default("all"),
  due: z.string().optional().default("all"),
  sort: z.string().optional().default("due"),
});

export type TaskFilters = z.infer<typeof taskFiltersSchema>;
