"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, Trash2 } from "lucide-react";

import {
  deleteTaskAction,
  setTaskCompletionAction,
} from "@/features/tasks/actions";
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

export function TaskCompletionButton({
  id,
  completed,
}: {
  id: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={completed ? "outline" : "secondary"}
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await setTaskCompletionAction(id, !completed);
          router.refresh();
        });
      }}
    >
      {completed ? (
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Check className="h-4 w-4" aria-hidden="true" />
      )}
      {completed ? "Reopen" : "Complete"}
    </Button>
  );
}

export function DeleteTaskButton({ id, title }: { id: string; title: string }) {
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
          <AlertDialogTitle>Delete task</AlertDialogTitle>
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
                await deleteTaskAction(id);
                setOpen(false);
                router.refresh();
              });
            }}
          >
            Delete task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
