import { parseISO } from "date-fns";

import { NOTE_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/types/database";
import type { NoteFilters } from "@/features/notes/schemas";

export async function getNotesForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Notes query failed", error.message);
    throw new Error("Could not load notes.");
  }

  return data ?? [];
}

export function filterAndSortNotes(notes: Note[], filters: NoteFilters) {
  const normalizedSearch = filters.q.trim().toLowerCase();

  return notes
    .filter((note) => {
      if (
        normalizedSearch &&
        !`${note.title} ${note.content}`.toLowerCase().includes(normalizedSearch)
      ) {
        return false;
      }

      if (filters.note_type !== "all" && (NOTE_TYPES as readonly string[]).includes(filters.note_type)) {
        if (note.note_type !== filters.note_type) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) {
        return a.is_pinned ? -1 : 1;
      }

      return parseISO(b.updated_at).getTime() - parseISO(a.updated_at).getTime();
    });
}

export async function getRecentNotesForDashboard(userId: string) {
  const notes = await getNotesForUser(userId);
  return notes.slice(0, 5);
}
