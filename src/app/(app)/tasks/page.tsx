import { PageHeader } from "@/components/app/page-header";
import { createTaskAction } from "@/features/tasks/actions";
import { TaskFilterForm } from "@/features/tasks/task-filter-form";
import { TaskForm } from "@/features/tasks/task-form";
import { TaskList } from "@/features/tasks/task-list";
import { filterAndSortTasks, getTasksForUser } from "@/features/tasks/queries";
import { taskFiltersSchema } from "@/features/tasks/schemas";
import { getProfile } from "@/features/profiles/queries";
import { getTaskLinkOptions } from "@/features/tasks/link-queries";
import { requireUser } from "@/lib/auth";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  const profile = await getProfile(user);
  const rawSearchParams = await searchParams;
  const filters = taskFiltersSchema.parse({
    q: stringParam(rawSearchParams.q),
    category: stringParam(rawSearchParams.category) || "all",
    priority: stringParam(rawSearchParams.priority) || "all",
    status: stringParam(rawSearchParams.status) || "all",
    due: stringParam(rawSearchParams.due) || "all",
    sort: stringParam(rawSearchParams.sort) || "due",
  });
  const [tasks, linkOptions] = await Promise.all([getTasksForUser(user.id), getTaskLinkOptions(user.id)]);
  const filteredTasks = filterAndSortTasks(tasks, filters, profile.timezone);

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Capture, plan, complete, reopen, search, filter, and sort your work."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="space-y-4">
          <TaskFilterForm filters={filters} />
          <TaskList tasks={filteredTasks} timeZone={profile.timezone} projects={linkOptions.projects} goals={linkOptions.goals} />
        </section>
        <aside className="rounded-md border border-zinc-800 bg-zinc-950 p-4 xl:sticky xl:top-6 xl:self-start">
          <h2 className="mb-4 text-lg font-semibold text-zinc-50">Create task</h2>
          <TaskForm
            timeZone={profile.timezone}
            action={createTaskAction}
            onSuccessReset
            projects={linkOptions.projects}
            goals={linkOptions.goals}
          />
        </aside>
      </div>
    </>
  );
}

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
