export default function GoalsPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Goals</h1>
        <p className="mt-2 text-muted-foreground">
          Create goals, track milestones, and monitor your progress.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-medium">No goals yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your goals will appear here after you create them.
        </p>
      </div>
    </main>
  );
}