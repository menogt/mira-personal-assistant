-- MIRA Part 3: project milestone dates and supporting indexes.
alter table public.project_milestones add column if not exists due_date date;
create index if not exists project_milestones_due_date_idx on public.project_milestones (user_id, due_date);
create index if not exists study_sessions_module_date_idx on public.study_sessions (module_id, session_date desc);
