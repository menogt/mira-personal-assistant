create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  timezone text not null default 'Asia/Colombo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  priority text not null,
  status text not null default 'todo',
  due_at timestamptz,
  estimated_minutes integer,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_title_nonempty check (char_length(btrim(title)) > 0),
  constraint tasks_category_allowed check (
    category in ('university', 'project', 'freelance', 'personal', 'health', 'content', 'finance', 'general')
  ),
  constraint tasks_priority_allowed check (
    priority in ('low', 'medium', 'high', 'urgent')
  ),
  constraint tasks_status_allowed check (
    status in ('todo', 'in_progress', 'completed', 'cancelled')
  ),
  constraint tasks_estimated_minutes_nonnegative check (
    estimated_minutes is null or estimated_minutes >= 0
  )
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  note_type text not null default 'general',
  source_url text,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notes_title_nonempty check (char_length(btrim(title)) > 0),
  constraint notes_content_nonempty check (char_length(btrim(content)) > 0),
  constraint notes_note_type_allowed check (
    note_type in ('idea', 'link', 'reflection', 'university', 'project', 'meeting', 'content', 'general')
  )
);

create table if not exists public.daily_focus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  focus_date date not null,
  task_id uuid references public.tasks(id) on delete set null,
  custom_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_focus_user_date_unique unique (user_id, focus_date),
  constraint daily_focus_has_target check (
    task_id is not null or nullif(btrim(coalesce(custom_text, '')), '') is not null
  )
);

create index if not exists tasks_user_status_due_idx on public.tasks (user_id, status, due_at);
create index if not exists notes_user_type_updated_idx on public.notes (user_id, note_type, updated_at desc);
create index if not exists daily_focus_user_date_idx on public.daily_focus (user_id, focus_date);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

drop trigger if exists daily_focus_set_updated_at on public.daily_focus;
create trigger daily_focus_set_updated_at
before update on public.daily_focus
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.ensure_daily_focus_task_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.task_id is not null and not exists (
    select 1
    from public.tasks
    where id = new.task_id
      and user_id = new.user_id
  ) then
    raise exception 'daily_focus task_id must belong to the same user';
  end if;

  return new;
end;
$$;

drop trigger if exists daily_focus_task_owner on public.daily_focus;
create trigger daily_focus_task_owner
before insert or update on public.daily_focus
for each row execute function public.ensure_daily_focus_task_owner();

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.daily_focus enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Profiles are deletable by owner" on public.profiles;
create policy "Profiles are deletable by owner"
on public.profiles for delete
using (auth.uid() = id);

drop policy if exists "Tasks are selectable by owner" on public.tasks;
create policy "Tasks are selectable by owner"
on public.tasks for select
using (auth.uid() = user_id);

drop policy if exists "Tasks are insertable by owner" on public.tasks;
create policy "Tasks are insertable by owner"
on public.tasks for insert
with check (auth.uid() = user_id);

drop policy if exists "Tasks are updatable by owner" on public.tasks;
create policy "Tasks are updatable by owner"
on public.tasks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Tasks are deletable by owner" on public.tasks;
create policy "Tasks are deletable by owner"
on public.tasks for delete
using (auth.uid() = user_id);

drop policy if exists "Notes are selectable by owner" on public.notes;
create policy "Notes are selectable by owner"
on public.notes for select
using (auth.uid() = user_id);

drop policy if exists "Notes are insertable by owner" on public.notes;
create policy "Notes are insertable by owner"
on public.notes for insert
with check (auth.uid() = user_id);

drop policy if exists "Notes are updatable by owner" on public.notes;
create policy "Notes are updatable by owner"
on public.notes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Notes are deletable by owner" on public.notes;
create policy "Notes are deletable by owner"
on public.notes for delete
using (auth.uid() = user_id);

drop policy if exists "Daily focus selectable by owner" on public.daily_focus;
create policy "Daily focus selectable by owner"
on public.daily_focus for select
using (auth.uid() = user_id);

drop policy if exists "Daily focus insertable by owner" on public.daily_focus;
create policy "Daily focus insertable by owner"
on public.daily_focus for insert
with check (auth.uid() = user_id);

drop policy if exists "Daily focus updatable by owner" on public.daily_focus;
create policy "Daily focus updatable by owner"
on public.daily_focus for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Daily focus deletable by owner" on public.daily_focus;
create policy "Daily focus deletable by owner"
on public.daily_focus for delete
using (auth.uid() = user_id);
