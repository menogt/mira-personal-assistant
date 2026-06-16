import Link from "next/link";
import { Pencil } from "lucide-react";

import { updateNoteAction } from "@/features/notes/actions";
import { DeleteNoteButton, PinNoteButton } from "@/features/notes/note-actions";
import { NoteForm } from "@/features/notes/note-form";
import { NOTE_TYPE_LABELS } from "@/lib/constants";
import type { Note } from "@/types/database";
import { Badge } from "@/components/ui/badge";

export function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return (
      <div className="rounded-md border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">
        No notes match the current view.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {notes.map((note) => (
        <article key={note.id} className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="break-words text-lg font-semibold text-zinc-50">{note.title}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>{NOTE_TYPE_LABELS[note.note_type as keyof typeof NOTE_TYPE_LABELS]}</Badge>
                {note.is_pinned ? <Badge className="border-emerald-800 text-emerald-200">Pinned</Badge> : null}
              </div>
            </div>
          </div>
          <p className="mt-3 line-clamp-6 whitespace-pre-wrap break-words text-sm text-zinc-400">
            {note.content}
          </p>
          {note.source_url ? (
            <Link
              className="mt-3 inline-block break-all text-sm text-emerald-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              href={note.source_url}
              target="_blank"
              rel="noreferrer"
            >
              {note.source_url}
            </Link>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <PinNoteButton id={note.id} isPinned={note.is_pinned} />
            <DeleteNoteButton id={note.id} title={note.title} />
          </div>
          <details className="mt-4 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit note
            </summary>
            <div className="mt-4">
              <NoteForm note={note} action={updateNoteAction.bind(null, note.id)} />
            </div>
          </details>
        </article>
      ))}
    </div>
  );
}
