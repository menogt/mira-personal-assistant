export default function UniversityPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">University</h1>
        <p className="mt-2 text-muted-foreground">
          Manage modules, assignments, lectures, and study sessions.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-medium">No university modules yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your modules will appear here after you add them.
        </p>
      </div>
    </main>
  );
}