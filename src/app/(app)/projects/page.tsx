export default function ProjectsPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="mt-2 text-muted-foreground">
          Track project progress, next actions, milestones, and blockers.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-medium">No projects yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your projects will appear here after you create them.
        </p>
      </div>
    </main>
  );
}