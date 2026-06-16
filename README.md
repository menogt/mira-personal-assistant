# MIRA

MIRA, Menaka's Intelligent Routine Assistant, is a private personal productivity app. Phase 1 establishes the secure data foundation for tasks, notes, daily focus, authentication, and settings. It does not include AI features.

## Phase 1 Features

- Supabase email/password authentication with protected app routes.
- Responsive navigation for dashboard, tasks, notes, settings, and logout.
- Today dashboard with timezone-aware greeting, deterministic focus recommendation, progress summary, today's tasks, timed schedule, upcoming tasks, and recent notes.
- Task CRUD with validation, search, filters, sorting, completion, reopening, and delete confirmation.
- Notes CRUD with validation, pinning, search, type filter, responsive cards, and delete confirmation.
- Daily focus selection from an existing task or custom text.
- Minimal settings for display name, timezone, local theme preference, and logout.
- Version-controlled Supabase schema migration with constraints, indexes, triggers, profile auto-creation, and RLS policies.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components built on Radix primitives
- Supabase PostgreSQL and Supabase Auth
- Zod
- React Hook Form
- date-fns

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Only the anon key belongs in the app environment. Do not add a Supabase service-role key to this project.

4. Start the dev server:

```bash
npm run dev
```

## Supabase Setup

1. Create a Supabase project.
2. Enable Email provider authentication in Supabase Auth.
3. Create the first private user manually from the Supabase dashboard, or invite the user through Supabase Auth.
4. Apply the migration in `supabase/migrations/20260616143000_phase_1_foundation.sql`.

Using the Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Or paste the SQL migration into the Supabase SQL editor and run it once.

## Database Types

Manual database types are provided in `src/types/database.ts`. After connecting the Supabase CLI, you can regenerate them with:

```bash
npx supabase gen types typescript --project-id your-project-ref --schema public > src/types/database.ts
```

Review regenerated relationship types before committing.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

## Vercel Deployment

1. Create a new Vercel project from this repository.
2. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Apply the Supabase migration before using the deployed app.
4. Deploy with the default Next.js build command:

```bash
npm run build
```

## Security Notes

- RLS is enabled for `profiles`, `tasks`, `notes`, and `daily_focus`.
- Policies restrict profile records with `auth.uid() = id`.
- Policies restrict task, note, and daily-focus records with `auth.uid() = user_id`.
- A database trigger prevents assigning another user's task as daily focus.
- The migration creates profile rows automatically when Supabase Auth users are created.
- `.env.local` and other real env files are ignored. `.env.example` contains only safe variable names.

## Known Phase 1 Limitations

- No AI assistant, AI API calls, voice, notifications, calendars, GitHub integration, teams, payments, goals, projects tracker, habit tracking, recurring tasks, document uploads, finance tracking, or university module system.
- The app is designed for a single private user account model, though RLS supports multiple private users.
- Theme preference is stored locally in the browser, not in Supabase.
- Manual verification requires a configured Supabase project and an authenticated user.

## Future Phases

Future phases may add AI-assisted planning, goals, projects, university workflows, reminders, calendar integrations, voice, and richer automation. These are intentionally not implemented in Phase 1.
