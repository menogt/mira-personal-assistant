"use server";

import { revalidatePath } from "next/cache";

import { noteFormSchema, type NoteFormValues } from "@/features/notes/schemas";
import { requireUser } from "@/lib/auth";
import type { ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";

function revalidateNoteViews() {
  revalidatePath("/dashboard");
  revalidatePath("/notes");
}

export async function createNoteAction(values: NoteFormValues): Promise<ActionResult> {
  const parsed = noteFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the note form.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    title: parsed.data.title,
    content: parsed.data.content,
    note_type: parsed.data.note_type,
    source_url: parsed.data.source_url?.trim() || null,
    is_pinned: parsed.data.is_pinned,
  });

  if (error) {
    console.error("Create note failed", error.message);
    return { ok: false, message: "Could not create the note." };
  }

  revalidateNoteViews();
  return { ok: true, message: "Note created." };
}

export async function updateNoteAction(
  id: string,
  values: NoteFormValues,
): Promise<ActionResult> {
  const parsed = noteFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the note form.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({
      title: parsed.data.title,
      content: parsed.data.content,
      note_type: parsed.data.note_type,
      source_url: parsed.data.source_url?.trim() || null,
      is_pinned: parsed.data.is_pinned,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Update note failed", error.message);
    return { ok: false, message: "Could not update the note." };
  }

  revalidateNoteViews();
  return { ok: true, message: "Note updated." };
}

export async function deleteNoteAction(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    console.error("Delete note failed", error.message);
    return { ok: false, message: "Could not delete the note." };
  }

  revalidateNoteViews();
  return { ok: true, message: "Note deleted." };
}

export async function setNotePinnedAction(id: string, isPinned: boolean): Promise<ActionResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ is_pinned: isPinned })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Update note pin failed", error.message);
    return { ok: false, message: "Could not update the note." };
  }

  revalidateNoteViews();
  return { ok: true, message: isPinned ? "Note pinned." : "Note unpinned." };
}
