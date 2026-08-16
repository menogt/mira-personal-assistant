-- MIRA Part 2: task recurrence and relationships for Tasks & Goals.

alter table public.tasks
  add column if not exists recurrence text,
  add column if not exists project_id uuid references public.projects(id) on delete set null,
  add column if not exists goal_id uuid references public.goals(id) on delete set null;

create index if not exists tasks_user_due_idx on public.tasks (user_id, due_at);
create index if not exists tasks_user_goal_idx on public.tasks (user_id, goal_id);
create index if not exists tasks_user_project_idx on public.tasks (user_id, project_id);

-- Keep linked records single-tenant. These checks run before insert/update.
create or replace function public.ensure_task_links_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.project_id is not null and not exists (
    select 1 from public.projects where id = new.project_id and user_id = new.user_id
  ) then
    raise exception 'task project_id must belong to the same user';
  end if;
  if new.goal_id is not null and not exists (
    select 1 from public.goals where id = new.goal_id and user_id = new.user_id
  ) then
    raise exception 'task goal_id must belong to the same user';
  end if;
  return new;
end;
$$;

drop trigger if exists task_links_owner on public.tasks;
create trigger task_links_owner before insert or update on public.tasks
for each row execute function public.ensure_task_links_owner();

-- Existing installations may have the task table from the foundation migration.
-- The policies already scope task rows by auth.uid(); this migration only adds fields.
