import { z } from "zod";

import { NOTE_TYPES } from "@/lib/constants";

export const noteFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160, "Keep the title shorter."),
  content: z.string().trim().min(1, "Content is required."),
  note_type: z.enum(NOTE_TYPES, { error: "Choose a note type." }),
  source_url: z
    .string()
    .optional()
    .refine((value) => {
      if (!value?.trim()) {
        return true;
      }

      return z.string().url().safeParse(value.trim()).success;
    }, "Enter a valid URL."),
  is_pinned: z.boolean(),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;

export const noteFiltersSchema = z.object({
  q: z.string().optional().default(""),
  note_type: z.string().optional().default("all"),
  sort: z.string().optional().default("updated"),
});

export type NoteFilters = z.infer<typeof noteFiltersSchema>;
