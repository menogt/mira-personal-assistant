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

export const GOAL_CATEGORIES = [
  "financial",
  "academic",
  "project",
  "health",
  "personal",
  "career",
  "content",
  "general",
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const GOAL_STATUSES = [
  "not_started",
  "active",
  "paused",
  "completed",
  "cancelled",
] as const;

export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const PROJECT_STATUSES = [
  "planned",
  "active",
  "paused",
  "blocked",
  "completed",
  "archived",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const MODULE_STATUSES = ["upcoming", "active", "completed", "dropped"] as const;

export type ModuleStatus = (typeof MODULE_STATUSES)[number];

export const LECTURE_ATTENDANCE_STATUSES = [
  "scheduled",
  "attended",
  "absent",
  "cancelled",
] as const;

export type LectureAttendanceStatus = (typeof LECTURE_ATTENDANCE_STATUSES)[number];

export const ASSIGNMENT_STATUSES = [
  "not_started",
  "in_progress",
  "submitted",
  "graded",
  "cancelled",
] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const GOAL_CATEGORY_LABELS: Record<GoalCategory, string> = {
  financial: "Financial",
  academic: "Academic",
  project: "Project",
  health: "Health",
  personal: "Personal",
  career: "Career",
  content: "Content",
  general: "General",
};

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  not_started: "Not started",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planned",
  active: "Active",
  paused: "Paused",
  blocked: "Blocked",
  completed: "Completed",
  archived: "Archived",
};

export const MODULE_STATUS_LABELS: Record<ModuleStatus, string> = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Completed",
  dropped: "Dropped",
};

export const LECTURE_ATTENDANCE_STATUS_LABELS: Record<LectureAttendanceStatus, string> = {
  scheduled: "Scheduled",
  attended: "Attended",
  absent: "Absent",
  cancelled: "Cancelled",
};

export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  graded: "Graded",
  cancelled: "Cancelled",
};
