import { PageHeader } from "@/components/app/page-header";
import { createNoteAction } from "@/features/notes/actions";
import { NoteFilterForm } from "@/features/notes/note-filter-form";
import { NoteForm } from "@/features/notes/note-form";
import { NoteList } from "@/features/notes/note-list";
import { filterAndSortNotes, getNotesForUser } from "@/features/notes/queries";
import { noteFiltersSchema } from "@/features/notes/schemas";
import { requireUser } from "@/lib/auth";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NotesPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  const rawSearchParams = await searchParams;
  const filters = noteFiltersSchema.parse({
    q: stringParam(rawSearchParams.q),
    note_type: stringParam(rawSearchParams.note_type) || "all",
    sort: stringParam(rawSearchParams.sort) || "updated",
  });
  const notes = await getNotesForUser(user.id);
  const filteredNotes = filterAndSortNotes(notes, filters);

  return (
    <>
      <PageHeader
        title="Notes"
        description="Keep private ideas, links, reflections, meeting notes, and project context."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="space-y-4">
          <NoteFilterForm filters={filters} />
          <NoteList notes={filteredNotes} />
        </section>
        <aside className="rounded-md border border-zinc-800 bg-zinc-950 p-4 xl:sticky xl:top-6 xl:self-start">
          <h2 className="mb-4 text-lg font-semibold text-zinc-50">Create note</h2>
          <NoteForm action={createNoteAction} onSuccessReset />
        </aside>
      </div>
    </>
  );
}

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
