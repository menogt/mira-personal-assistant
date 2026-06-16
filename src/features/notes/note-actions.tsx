"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pin, PinOff, Trash2 } from "lucide-react";

import { deleteNoteAction, setNotePinnedAction } from "@/features/notes/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function PinNoteButton({ id, isPinned }: { id: string; isPinned: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={isPinned ? "outline" : "secondary"}
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await setNotePinnedAction(id, !isPinned);
          router.refresh();
        });
      }}
    >
      {isPinned ? (
        <PinOff className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Pin className="h-4 w-4" aria-hidden="true" />
      )}
      {isPinned ? "Unpin" : "Pin"}
    </Button>
  );
}

export function DeleteNoteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete note</AlertDialogTitle>
          <AlertDialogDescription>
            Delete &quot;{title}&quot;? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-rose-500 text-white hover:bg-rose-400"
            onClick={(event) => {
              event.preventDefault();
              startTransition(async () => {
                await deleteNoteAction(id);
                setOpen(false);
                router.refresh();
              });
            }}
          >
            Delete note
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
