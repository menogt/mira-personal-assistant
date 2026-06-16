export const TASK_CATEGORIES = [
  "university",
  "project",
  "freelance",
  "personal",
  "health",
  "content",
  "finance",
  "general",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const NOTE_TYPES = [
  "idea",
  "link",
  "reflection",
  "university",
  "project",
  "meeting",
  "content",
  "general",
] as const;

export type NoteType = (typeof NOTE_TYPES)[number];

export const TASK_CATEGORY_LABELS: Record<(typeof TASK_CATEGORIES)[number], string> = {
  university: "University",
  project: "Project",
  freelance: "Freelance",
  personal: "Personal",
  health: "Health",
  content: "Content",
  finance: "Finance",
  general: "General",
};

export const TASK_PRIORITY_LABELS: Record<(typeof TASK_PRIORITIES)[number], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const TASK_STATUS_LABELS: Record<(typeof TASK_STATUSES)[number], string> = {
  todo: "Todo",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const NOTE_TYPE_LABELS: Record<(typeof NOTE_TYPES)[number], string> = {
  idea: "Idea",
  link: "Link",
  reflection: "Reflection",
  university: "University",
  project: "Project",
  meeting: "Meeting",
  content: "Content",
  general: "General",
};

export const PRIORITY_WEIGHT: Record<(typeof TASK_PRIORITIES)[number], number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const TIMEZONES = [
  "Asia/Colombo",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "UTC",
] as const;

export type AppTimezone = (typeof TIMEZONES)[number];
