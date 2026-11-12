"use client";

import { useActionState } from "react";
import { deleteNote } from "./actions";

export default function DeleteNoteButton({ noteId }: { noteId: string }) {
  const [state, formAction, isPending] = useActionState(deleteNote, {});

  return (
    <div>
      <form
        action={formAction}
        onSubmit={(event) => {
          if (
            !window.confirm(
              "Are you sure you want to delete this note? This action cannot be undone.",
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <input name="id" type="hidden" value={noteId} />
        <button
          className="inline-flex min-h-10 items-center rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-wait disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </form>
      {state.error && (
        <p aria-live="polite" className="mt-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </div>
  );
}
