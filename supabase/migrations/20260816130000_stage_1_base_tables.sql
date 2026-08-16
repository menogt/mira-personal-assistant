-- MIRA Stage 1: base tables for future routine, project, university, and review features.
-- This migration intentionally adds data foundations only; later stages will add CRUD and assistant actions.

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'personal',
  reason text,
  deadline date,
  progress integer not null default 0 check (progress between 0 and 100),
  milestones jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active',
  priority text not null default 'medium',
  progress integer not null default 0 check (progress between 0 and 100),
  next_action text,
  blocker text,
  github_url text,
  live_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  is_complete boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  code text,
  lecturer text,
  schedule jsonb not null default '[]'::jsonb,
  current_topic text,
  confidence_level integer check (confidence_level between 0 and 100),
  notes text,
  assignment_deadlines jsonb not null default '[]'::jsonb,
  exam_dates jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  duration_minutes integer not null check (duration_minutes > 0),
  topic text,
  session_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null,
  mood integer check (mood between 1 and 5),
  energy integer check (energy between 1 and 5),
  note text,
  completed_task_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

create index if not exists goals_user_deadline_idx on public.goals (user_id, deadline);
create index if not exists projects_user_status_idx on public.projects (user_id, status);
create index if not exists project_milestones_project_position_idx on public.project_milestones (project_id, position);
create index if not exists modules_user_idx on public.modules (user_id);
create index if not exists study_sessions_user_date_idx on public.study_sessions (user_id, session_date desc);
create index if not exists daily_checkins_user_date_idx on public.daily_checkins (user_id, checkin_date desc);

create trigger goals_set_updated_at before update on public.goals for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger project_milestones_set_updated_at before update on public.project_milestones for each row execute function public.set_updated_at();
create trigger modules_set_updated_at before update on public.modules for each row execute function public.set_updated_at();
create trigger daily_checkins_set_updated_at before update on public.daily_checkins for each row execute function public.set_updated_at();

alter table public.goals enable row level security;
alter table public.projects enable row level security;
alter table public.project_milestones enable row level security;
alter table public.modules enable row level security;
alter table public.study_sessions enable row level security;
alter table public.daily_checkins enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['goals','projects','project_milestones','modules','study_sessions','daily_checkins'] loop
    execute format('drop policy if exists %I on public.%I', table_name || '_owner_select', table_name);
    execute format('create policy %I on public.%I for select using (auth.uid() = user_id)', table_name || '_owner_select', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_owner_insert', table_name);
    execute format('create policy %I on public.%I for insert with check (auth.uid() = user_id)', table_name || '_owner_insert', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_owner_update', table_name);
    execute format('create policy %I on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', table_name || '_owner_update', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_owner_delete', table_name);
    execute format('create policy %I on public.%I for delete using (auth.uid() = user_id)', table_name || '_owner_delete', table_name);
  end loop;
end $$;

-- Milestones must not be able to reference a project owned by another account.
create or replace function public.ensure_project_milestone_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.projects where id = new.project_id and user_id = new.user_id) then
    raise exception 'project_milestone project_id must belong to the same user';
  end if;
  return new;
end;
$$;
drop trigger if exists project_milestone_owner on public.project_milestones;
create trigger project_milestone_owner before insert or update on public.project_milestones for each row execute function public.ensure_project_milestone_owner();

-- Study sessions must not be able to reference a module owned by another account.
create or replace function public.ensure_study_session_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.modules where id = new.module_id and user_id = new.user_id) then
    raise exception 'study_session module_id must belong to the same user';
  end if;
  return new;
end;
$$;
drop trigger if exists study_session_owner on public.study_sessions;
create trigger study_session_owner before insert or update on public.study_sessions for each row execute function public.ensure_study_session_owner();
