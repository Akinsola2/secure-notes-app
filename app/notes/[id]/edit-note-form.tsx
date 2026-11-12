"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { updateNote } from "@/app/actions";
import SuccessMessage from "@/app/success-message";
import NoteEditor from "@/app/note-editor";

export default function EditNoteForm({
  note,
}: {
  note: { id: string; title: string; body: string; tag: string };
}) {
  const [state, formAction, isPending] = useActionState(updateNote, {});
  const [body, setBody] = useState(note.body);

  return (
    <form action={formAction} className="mt-5 space-y-4">
      <input name="id" type="hidden" value={note.id} />
      <label className="block text-sm font-semibold text-blue-950">
        Note Title
        <input
          className="mt-1.5 min-h-12 w-full rounded-xl border border-blue-200 bg-blue-50/30 px-3.5 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          defaultValue={note.title}
          name="title"
          required
          type="text"
        />
      </label>
      <label className="block text-sm font-semibold text-blue-950">
        Tags
        <input
          className="mt-1.5 min-h-12 w-full rounded-xl border border-blue-200 bg-blue-50/30 px-3.5 py-2.5 text-base text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          defaultValue={note.tag}
          name="tag"
          required
          type="text"
        />
      </label>
      <NoteEditor
          label="Note body"
          name="body"
          onChange={setBody}
          required
          rows={6}
          value={body}
        />
      {state.error && (
        <p aria-live="polite" className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          href="/"
        >
          Cancel
        </Link>
        <button
          className="min-h-12 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
      {state.success && !isPending && (
        <SuccessMessage key={state.successAt} message={state.success} />
      )}
    </form>
  );
}
