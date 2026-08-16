# MIRA

**MIRA (Menaka’s Intelligent Routine Assistant)** is a private, single-user routine dashboard. This repository contains **Stage 1 only**: the Next.js foundation, Supabase authentication/session handling, a private email allowlist, the Today dashboard shell, and the database foundation for later stages.

> Later-stage CRUD screens, AI chat, project workflows, university workflows, and notes workflows are intentionally not presented as complete in this stage.

## Stage 1

The protected app currently includes a calm Today briefing with empty states for the main priority, today’s tasks, today’s university schedule, upcoming deadlines, and recent progress. The shell includes the dashboard and settings surfaces only. There is no public signup route.

The Supabase migrations establish `tasks`, `goals`, `projects`, `project_milestones`, `modules`, `study_sessions`, `notes`, and `daily_checkins`, plus the existing profile support. Row-level security restricts every record to its authenticated owner. Cross-record triggers prevent milestones and study sessions from referencing another owner’s project or module.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS with local shadcn/ui-style components
- Supabase PostgreSQL and Supabase Auth
- Zod and React Hook Form where feature forms are introduced

## Local setup

Install dependencies and copy the environment template:

```bash
npm install
cp .env.example .env.local
```

Set the following variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
MIRA_ALLOWED_EMAIL=your-private-login-email@example.com
```

`MIRA_ALLOWED_EMAIL` is the one email permitted to use this deployment. Create that one user in Supabase Auth with the Email provider enabled. Do not add a signup flow and do not commit real environment files or service-role keys.

Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Supabase schema

Apply both SQL migrations in `supabase/migrations/` through the Supabase SQL Editor, or link the project with the Supabase CLI and run:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

The first migration creates the profile, task, note, and daily-focus foundation used by the existing session/profile helpers. The Stage 1 migration adds the remaining base tables and owner-only policies.

## Validation commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

Deploy the repository as a Next.js project on Vercel. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `MIRA_ALLOWED_EMAIL` to the deployment environment, apply the Supabase migrations, and deploy with the default build command:

```bash
npm run build
```

## Assumptions

The Supabase project supplied for this build is the source of truth for authentication and persistence. The private email allowlist is intentionally environment-based rather than hardcoded into Git. Since this is a single-user application, the schema keeps `user_id` for safe ownership boundaries but does not introduce an application-managed users table. The next stage can add the CRUD screens on top of these tables without changing the Stage 1 authentication model.
