"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";

import { NOTE_TYPES, NOTE_TYPE_LABELS, type NoteType } from "@/lib/constants";
import type { ActionResult } from "@/lib/action-result";
import type { Note } from "@/types/database";
import { noteFormSchema, type NoteFormValues } from "@/features/notes/schemas";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function NoteForm({
  note,
  action,
  onSuccessReset = false,
}: {
  note?: Note;
  action: (values: NoteFormValues) => Promise<ActionResult>;
  onSuccessReset?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const defaultValues = useMemo<NoteFormValues>(
    () => ({
      title: note?.title ?? "",
      content: note?.content ?? "",
      note_type: safeNoteType(note?.note_type),
      source_url: note?.source_url ?? "",
      is_pinned: note?.is_pinned ?? false,
    }),
    [note],
  );

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const response = await action(values);
      setResult(response);

      if (response.ok) {
        if (onSuccessReset) {
          form.reset(defaultValues);
        }
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`note-title-${note?.id ?? "new"}`}>Title</Label>
        <Input id={`note-title-${note?.id ?? "new"}`} {...form.register("title")} />
        <FieldError message={form.formState.errors.title?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`note-content-${note?.id ?? "new"}`}>Content</Label>
        <Textarea id={`note-content-${note?.id ?? "new"}`} rows={7} {...form.register("content")} />
        <FieldError message={form.formState.errors.content?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Note type</Label>
          <Controller
            control={form.control}
            name="note_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTE_TYPES.map((noteType) => (
                    <SelectItem key={noteType} value={noteType}>
                      {NOTE_TYPE_LABELS[noteType]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={form.formState.errors.note_type?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`source-url-${note?.id ?? "new"}`}>Source URL</Label>
          <Input id={`source-url-${note?.id ?? "new"}`} type="url" {...form.register("source_url")} />
          <FieldError message={form.formState.errors.source_url?.message} />
        </div>
      </div>

      <label className="flex min-h-10 items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 text-sm text-zinc-200">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-emerald-300 focus:ring-emerald-300"
          {...form.register("is_pinned")}
        />
        Pinned
      </label>

      {result ? (
        <p
          role="status"
          className={
            result.ok
              ? "rounded-md border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200"
              : "rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-200"
          }
        >
          {result.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        <Save className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Saving..." : note ? "Save note" : "Create note"}
      </Button>
    </form>
  );
}

function safeNoteType(value: string | undefined): NoteType {
  return NOTE_TYPES.includes(value as NoteType) ? (value as NoteType) : "general";
}
