import { NOTE_TYPES, NOTE_TYPE_LABELS } from "@/lib/constants";
import type { NoteFilters } from "@/features/notes/schemas";
import { Button } from "@/components/ui/button";

export function NoteFilterForm({ filters }: { filters: NoteFilters }) {
  return (
    <form className="grid gap-3 rounded-md border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-4" action="/notes">
      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-medium text-zinc-200">Search</span>
        <input
          name="q"
          defaultValue={filters.q}
          className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          placeholder="Title or content"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-zinc-200">Type</span>
        <select
          name="note_type"
          defaultValue={filters.note_type}
          className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          <option value="all">All</option>
          {NOTE_TYPES.map((noteType) => (
            <option key={noteType} value={noteType}>
              {NOTE_TYPE_LABELS[noteType]}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-zinc-200">Sort</span>
        <select
          name="sort"
          defaultValue={filters.sort}
          className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          <option value="updated">Recently updated</option>
        </select>
      </label>
      <div className="flex items-end gap-2 md:col-span-4">
        <Button type="submit">Apply filters</Button>
        <Button type="reset" variant="outline" asChild>
          <a href="/notes">Clear</a>
        </Button>
      </div>
    </form>
  );
}
