create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  reason text,
  category text not null,
  status text not null default 'not_started',
  progress integer not null default 0,
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_name_nonempty check (char_length(btrim(name)) > 0),
  constraint goals_category_allowed check (
    category in ('financial', 'academic', 'project', 'health', 'personal', 'career', 'content', 'general')
  ),
  constraint goals_status_allowed check (
    status in ('not_started', 'active', 'paused', 'completed', 'cancelled')
  ),
  constraint goals_progress_range check (progress between 0 and 100)
);

create table if not exists public.goal_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  is_completed boolean not null default false,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goal_milestones_title_nonempty check (char_length(btrim(title)) > 0)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'planned',
  priority text not null default 'medium',
  progress integer not null default 0,
  next_action text,
  blocker text,
  github_url text,
  live_url text,
  start_date date,
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_name_nonempty check (char_length(btrim(name)) > 0),
  constraint projects_status_allowed check (
    status in ('planned', 'active', 'paused', 'blocked', 'completed', 'archived')
  ),
  constraint projects_priority_allowed check (
    priority in ('low', 'medium', 'high', 'urgent')
  ),
  constraint projects_progress_range check (progress between 0 and 100)
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  is_completed boolean not null default false,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_milestones_title_nonempty check (char_length(btrim(title)) > 0)
);

create table if not exists public.university_modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_name text not null,
  module_code text,
  lecturer text,
  current_topic text,
  confidence_level integer,
  status text not null default 'active',
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint university_modules_name_nonempty check (char_length(btrim(module_name)) > 0),
  constraint university_modules_confidence_range check (
    confidence_level is null or confidence_level between 1 and 5
  ),
  constraint university_modules_status_allowed check (
    status in ('upcoming', 'active', 'completed', 'dropped')
  )
);

create table if not exists public.lectures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.university_modules(id) on delete cascade,
  title text not null,
  topic text,
  lecture_date date not null,
  start_time time,
  end_time time,
  location text,
  notes text,
  attendance_status text not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lectures_title_nonempty check (char_length(btrim(title)) > 0),
  constraint lectures_attendance_status_allowed check (
    attendance_status in ('scheduled', 'attended', 'absent', 'cancelled')
  ),
  constraint lectures_time_order check (
    start_time is null or end_time is null or end_time > start_time
  )
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.university_modules(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'not_started',
  priority text not null default 'medium',
  due_at timestamptz,
  progress integer not null default 0,
  submission_url text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assignments_title_nonempty check (char_length(btrim(title)) > 0),
  constraint assignments_status_allowed check (
    status in ('not_started', 'in_progress', 'submitted', 'graded', 'cancelled')
  ),
  constraint assignments_priority_allowed check (
    priority in ('low', 'medium', 'high', 'urgent')
  ),
  constraint assignments_progress_range check (progress between 0 and 100)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.university_modules(id) on delete cascade,
  topic text not null,
  duration_minutes integer not null,
  studied_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint study_sessions_topic_nonempty check (char_length(btrim(topic)) > 0),
  constraint study_sessions_duration_range check (duration_minutes > 0 and duration_minutes <= 1440)
);

alter table public.tasks
  add column if not exists goal_id uuid references public.goals(id) on delete set null,
  add column if not exists project_id uuid references public.projects(id) on delete set null,
  add column if not exists module_id uuid references public.university_modules(id) on delete set null,
  add column if not exists assignment_id uuid references public.assignments(id) on delete set null;

create index if not exists goals_user_status_deadline_idx on public.goals (user_id, status, deadline);
create index if not exists goals_user_updated_idx on public.goals (user_id, updated_at desc);
create index if not exists goal_milestones_user_goal_idx on public.goal_milestones (user_id, goal_id, sort_order);
create index if not exists goal_milestones_due_idx on public.goal_milestones (user_id, due_date);

create index if not exists projects_user_status_target_idx on public.projects (user_id, status, target_date);
create index if not exists projects_user_priority_idx on public.projects (user_id, priority);
create index if not exists projects_user_updated_idx on public.projects (user_id, updated_at desc);
create index if not exists project_milestones_user_project_idx on public.project_milestones (user_id, project_id, sort_order);
create index if not exists project_milestones_due_idx on public.project_milestones (user_id, due_date);

create index if not exists university_modules_user_status_idx on public.university_modules (user_id, status);
create index if not exists university_modules_user_updated_idx on public.university_modules (user_id, updated_at desc);
create index if not exists lectures_user_module_date_idx on public.lectures (user_id, module_id, lecture_date);
create index if not exists lectures_user_date_idx on public.lectures (user_id, lecture_date);
create index if not exists assignments_user_module_due_idx on public.assignments (user_id, module_id, due_at);
create index if not exists assignments_user_status_due_idx on public.assignments (user_id, status, due_at);
create index if not exists study_sessions_user_module_studied_idx on public.study_sessions (user_id, module_id, studied_at desc);
create index if not exists study_sessions_user_studied_idx on public.study_sessions (user_id, studied_at desc);

create index if not exists tasks_user_goal_idx on public.tasks (user_id, goal_id);
create index if not exists tasks_user_project_idx on public.tasks (user_id, project_id);
create index if not exists tasks_user_module_idx on public.tasks (user_id, module_id);
create index if not exists tasks_user_assignment_idx on public.tasks (user_id, assignment_id);

drop trigger if exists goals_set_updated_at on public.goals;
create trigger goals_set_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

drop trigger if exists goal_milestones_set_updated_at on public.goal_milestones;
create trigger goal_milestones_set_updated_at
before update on public.goal_milestones
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists project_milestones_set_updated_at on public.project_milestones;
create trigger project_milestones_set_updated_at
before update on public.project_milestones
for each row execute function public.set_updated_at();

drop trigger if exists university_modules_set_updated_at on public.university_modules;
create trigger university_modules_set_updated_at
before update on public.university_modules
for each row execute function public.set_updated_at();

drop trigger if exists lectures_set_updated_at on public.lectures;
create trigger lectures_set_updated_at
before update on public.lectures
for each row execute function public.set_updated_at();

drop trigger if exists assignments_set_updated_at on public.assignments;
create trigger assignments_set_updated_at
before update on public.assignments
for each row execute function public.set_updated_at();

drop trigger if exists study_sessions_set_updated_at on public.study_sessions;
create trigger study_sessions_set_updated_at
before update on public.study_sessions
for each row execute function public.set_updated_at();

create or replace function public.ensure_phase_2_parent_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_table_name = 'goal_milestones' then
    if not exists (select 1 from public.goals where id = new.goal_id and user_id = new.user_id) then
      raise exception 'goal_milestones.goal_id must belong to the same user';
    end if;
  elsif tg_table_name = 'project_milestones' then
    if not exists (select 1 from public.projects where id = new.project_id and user_id = new.user_id) then
      raise exception 'project_milestones.project_id must belong to the same user';
    end if;
  elsif tg_table_name in ('lectures', 'assignments', 'study_sessions') then
    if not exists (select 1 from public.university_modules where id = new.module_id and user_id = new.user_id) then
      raise exception '% module_id must belong to the same user', tg_table_name;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists goal_milestones_parent_owner on public.goal_milestones;
create trigger goal_milestones_parent_owner
before insert or update on public.goal_milestones
for each row execute function public.ensure_phase_2_parent_owner();

drop trigger if exists project_milestones_parent_owner on public.project_milestones;
create trigger project_milestones_parent_owner
before insert or update on public.project_milestones
for each row execute function public.ensure_phase_2_parent_owner();

drop trigger if exists lectures_parent_owner on public.lectures;
create trigger lectures_parent_owner
before insert or update on public.lectures
for each row execute function public.ensure_phase_2_parent_owner();

drop trigger if exists assignments_parent_owner on public.assignments;
create trigger assignments_parent_owner
before insert or update on public.assignments
for each row execute function public.ensure_phase_2_parent_owner();

drop trigger if exists study_sessions_parent_owner on public.study_sessions;
create trigger study_sessions_parent_owner
before insert or update on public.study_sessions
for each row execute function public.ensure_phase_2_parent_owner();

create or replace function public.ensure_task_phase_2_links_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.goal_id is not null and not exists (
    select 1 from public.goals where id = new.goal_id and user_id = new.user_id
  ) then
    raise exception 'tasks.goal_id must belong to the same user';
  end if;

  if new.project_id is not null and not exists (
    select 1 from public.projects where id = new.project_id and user_id = new.user_id
  ) then
    raise exception 'tasks.project_id must belong to the same user';
  end if;

  if new.module_id is not null and not exists (
    select 1 from public.university_modules where id = new.module_id and user_id = new.user_id
  ) then
    raise exception 'tasks.module_id must belong to the same user';
  end if;

  if new.assignment_id is not null and not exists (
    select 1
    from public.assignments
    where id = new.assignment_id
      and user_id = new.user_id
      and (new.module_id is null or module_id = new.module_id)
  ) then
    raise exception 'tasks.assignment_id must belong to the same user';
  end if;

  return new;
end;
$$;

drop trigger if exists tasks_phase_2_links_owner on public.tasks;
create trigger tasks_phase_2_links_owner
before insert or update on public.tasks
for each row execute function public.ensure_task_phase_2_links_owner();

alter table public.goals enable row level security;
alter table public.goal_milestones enable row level security;
alter table public.projects enable row level security;
alter table public.project_milestones enable row level security;
alter table public.university_modules enable row level security;
alter table public.lectures enable row level security;
alter table public.assignments enable row level security;
alter table public.study_sessions enable row level security;

drop policy if exists "Goals are selectable by owner" on public.goals;
create policy "Goals are selectable by owner" on public.goals for select using (auth.uid() = user_id);
drop policy if exists "Goals are insertable by owner" on public.goals;
create policy "Goals are insertable by owner" on public.goals for insert with check (auth.uid() = user_id);
drop policy if exists "Goals are updatable by owner" on public.goals;
create policy "Goals are updatable by owner" on public.goals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Goals are deletable by owner" on public.goals;
create policy "Goals are deletable by owner" on public.goals for delete using (auth.uid() = user_id);

drop policy if exists "Goal milestones are selectable by owner" on public.goal_milestones;
create policy "Goal milestones are selectable by owner" on public.goal_milestones for select using (auth.uid() = user_id);
drop policy if exists "Goal milestones are insertable by owner" on public.goal_milestones;
create policy "Goal milestones are insertable by owner" on public.goal_milestones for insert with check (auth.uid() = user_id);
drop policy if exists "Goal milestones are updatable by owner" on public.goal_milestones;
create policy "Goal milestones are updatable by owner" on public.goal_milestones for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Goal milestones are deletable by owner" on public.goal_milestones;
create policy "Goal milestones are deletable by owner" on public.goal_milestones for delete using (auth.uid() = user_id);

drop policy if exists "Projects are selectable by owner" on public.projects;
create policy "Projects are selectable by owner" on public.projects for select using (auth.uid() = user_id);
drop policy if exists "Projects are insertable by owner" on public.projects;
create policy "Projects are insertable by owner" on public.projects for insert with check (auth.uid() = user_id);
drop policy if exists "Projects are updatable by owner" on public.projects;
create policy "Projects are updatable by owner" on public.projects for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Projects are deletable by owner" on public.projects;
create policy "Projects are deletable by owner" on public.projects for delete using (auth.uid() = user_id);

drop policy if exists "Project milestones are selectable by owner" on public.project_milestones;
create policy "Project milestones are selectable by owner" on public.project_milestones for select using (auth.uid() = user_id);
drop policy if exists "Project milestones are insertable by owner" on public.project_milestones;
create policy "Project milestones are insertable by owner" on public.project_milestones for insert with check (auth.uid() = user_id);
drop policy if exists "Project milestones are updatable by owner" on public.project_milestones;
create policy "Project milestones are updatable by owner" on public.project_milestones for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Project milestones are deletable by owner" on public.project_milestones;
create policy "Project milestones are deletable by owner" on public.project_milestones for delete using (auth.uid() = user_id);

drop policy if exists "University modules are selectable by owner" on public.university_modules;
create policy "University modules are selectable by owner" on public.university_modules for select using (auth.uid() = user_id);
drop policy if exists "University modules are insertable by owner" on public.university_modules;
create policy "University modules are insertable by owner" on public.university_modules for insert with check (auth.uid() = user_id);
drop policy if exists "University modules are updatable by owner" on public.university_modules;
create policy "University modules are updatable by owner" on public.university_modules for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "University modules are deletable by owner" on public.university_modules;
create policy "University modules are deletable by owner" on public.university_modules for delete using (auth.uid() = user_id);

drop policy if exists "Lectures are selectable by owner" on public.lectures;
create policy "Lectures are selectable by owner" on public.lectures for select using (auth.uid() = user_id);
drop policy if exists "Lectures are insertable by owner" on public.lectures;
create policy "Lectures are insertable by owner" on public.lectures for insert with check (auth.uid() = user_id);
drop policy if exists "Lectures are updatable by owner" on public.lectures;
create policy "Lectures are updatable by owner" on public.lectures for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Lectures are deletable by owner" on public.lectures;
create policy "Lectures are deletable by owner" on public.lectures for delete using (auth.uid() = user_id);

drop policy if exists "Assignments are selectable by owner" on public.assignments;
create policy "Assignments are selectable by owner" on public.assignments for select using (auth.uid() = user_id);
drop policy if exists "Assignments are insertable by owner" on public.assignments;
create policy "Assignments are insertable by owner" on public.assignments for insert with check (auth.uid() = user_id);
drop policy if exists "Assignments are updatable by owner" on public.assignments;
create policy "Assignments are updatable by owner" on public.assignments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Assignments are deletable by owner" on public.assignments;
create policy "Assignments are deletable by owner" on public.assignments for delete using (auth.uid() = user_id);

drop policy if exists "Study sessions are selectable by owner" on public.study_sessions;
create policy "Study sessions are selectable by owner" on public.study_sessions for select using (auth.uid() = user_id);
drop policy if exists "Study sessions are insertable by owner" on public.study_sessions;
create policy "Study sessions are insertable by owner" on public.study_sessions for insert with check (auth.uid() = user_id);
drop policy if exists "Study sessions are updatable by owner" on public.study_sessions;
create policy "Study sessions are updatable by owner" on public.study_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Study sessions are deletable by owner" on public.study_sessions;
create policy "Study sessions are deletable by owner" on public.study_sessions for delete using (auth.uid() = user_id);
