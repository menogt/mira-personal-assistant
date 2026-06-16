import {
  TASK_CATEGORIES,
  TASK_CATEGORY_LABELS,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
} from "@/lib/constants";
import type { TaskFilters } from "@/features/tasks/schemas";
import { Button } from "@/components/ui/button";

export function TaskFilterForm({ filters }: { filters: TaskFilters }) {
  return (
    <form className="grid gap-3 rounded-md border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-6" action="/tasks">
      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-medium text-zinc-200">Search</span>
        <input
          name="q"
          defaultValue={filters.q}
          className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          placeholder="Title or description"
        />
      </label>
      <SelectField name="category" label="Category" value={filters.category}>
        <option value="all">All</option>
        {TASK_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {TASK_CATEGORY_LABELS[category]}
          </option>
        ))}
      </SelectField>
      <SelectField name="priority" label="Priority" value={filters.priority}>
        <option value="all">All</option>
        {TASK_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {TASK_PRIORITY_LABELS[priority]}
          </option>
        ))}
      </SelectField>
      <SelectField name="status" label="Status" value={filters.status}>
        <option value="all">All</option>
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {TASK_STATUS_LABELS[status]}
          </option>
        ))}
      </SelectField>
      <SelectField name="due" label="Due" value={filters.due}>
        <option value="all">All</option>
        <option value="today">Today</option>
        <option value="overdue">Overdue</option>
        <option value="next7">Next 7 days</option>
        <option value="none">No due date</option>
      </SelectField>
      <SelectField name="sort" label="Sort" value={filters.sort}>
        <option value="due">Due date</option>
        <option value="priority">Priority</option>
        <option value="created">Created date</option>
        <option value="updated">Recently updated</option>
      </SelectField>
      <div className="flex items-end gap-2 md:col-span-6">
        <Button type="submit">Apply filters</Button>
        <Button type="reset" variant="outline" asChild>
          <a href="/tasks">Clear</a>
        </Button>
      </div>
    </form>
  );
}

function SelectField({
  name,
  label,
  value,
  children,
}: {
  name: string;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        {children}
      </select>
    </label>
  );
}
