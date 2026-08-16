# MIRA

**MIRA (Menaka’s Intelligent Routine Assistant)** is a private, single-user routine dashboard for tasks, goals, projects, university work, notes, and an AI assistant.

## Current release

The application includes authenticated Today, Tasks, Goals, Projects, University, Notes, Settings, and Assistant surfaces. Notes are intentionally a dumping ground: saving a note never creates a task or project. The Assistant uses a server-only provider abstraction in `src/services/ai/provider.ts` and executes owner-scoped database tools against Supabase rather than inventing records.

Assistant tools currently include `create_task`, `complete_task`, `create_note`, `find_notes`, `update_project`, `get_today_plan`, `get_upcoming_deadlines`, `log_study_session`, and `generate_weekly_review`. The system prompt asks MIRA to be calm, direct, lightly dry, and evidence-led about overload and stalled projects.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS with local shadcn/ui-style components
- Supabase PostgreSQL and Supabase Auth
- Anthropic Claude Messages API
- Zod and React Hook Form

## Local setup

```bash
npm install
cp .env.example .env.local
```

Set these variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
XAI_API_KEY=your-xai-api-key
XAI_MODEL=grok-3-mini
```

`XAI_API_KEY` is read only on the server by the Assistant API route. Do not commit `.env.local`, real API keys, or Supabase service-role keys. The provider module keeps the chat UI and database tools independent from the provider implementation.

Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Supabase schema

Apply every SQL migration in `supabase/migrations/` through the Supabase SQL Editor, or link the project with the Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

The migrations create the profile, tasks, goals, projects, project milestones, modules, study sessions, notes, daily focus, and supporting indexes/policies. Row-level security restricts records to the authenticated owner, and cross-record constraints prevent milestones, tasks, and study sessions from crossing ownership boundaries.

## Assistant configuration

The Assistant route is `POST /api/assistant/chat`. It accepts a short conversation history and returns a final response plus the tools it actually called. Grok is accessed through `src/services/ai/provider.ts`; database execution lives in `src/features/assistant/tools.ts`. If `XAI_API_KEY` is absent, the UI reports a configuration error rather than returning fabricated content.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

Deploy the repository as a Next.js project on Vercel. Add the four environment variables listed above to the relevant Production/Preview environments, apply the Supabase migrations, and deploy with:

```bash
npm run build
```

## Assumptions

The supplied Supabase project is the source of truth for authentication and persistence. This remains a single-user application with owner-scoped `user_id` columns rather than an application-managed users table. Grok is the assistant provider; `XAI_MODEL` permits a model change without touching application code. Voice, calendar, GitHub, notifications, reminders, multi-user access, and provider-selection UI remain intentionally out of scope.
