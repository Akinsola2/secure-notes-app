"use client";

import { useActionState, useState } from "react";
import { addNote } from "./actions";
import type { NoteActionState } from "./note-types";
import NoteEditor from "./note-editor";
import SuccessMessage from "./success-message";

export default function NewNoteForm() {
  const [state, formAction, isPending] = useActionState(addNote, {});

  return (
    <NewNoteFields
      action={formAction}
      isPending={isPending}
      key={state.successAt ?? "new-note"}
      state={state}
    />
  );
}

function NewNoteFields({
  action,
  isPending,
  state,
}: {
  action: (formData: FormData) => void;
  isPending: boolean;
  state: NoteActionState;
}) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [body, setBody] = useState("");

  return (
    <section
      aria-labelledby="new-note-heading"
      className="rounded-3xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-7"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
          Capture a thought
        </p>
        <h2
          className="mt-1 text-xl font-semibold text-blue-950"
          id="new-note-heading"
        >
          New note
        </h2>
      </div>

      <form action={action} className="space-y-5">
        <label className="block text-sm font-semibold text-blue-950">
          Title
          <input
            autoComplete="off"
            className="mt-1.5 min-h-12 w-full rounded-xl border border-blue-200 bg-blue-50/30 px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            name="title"
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="Give your note a title"
            required
            type="text"
            value={title}
          />
        </label>

        <label className="block text-sm font-semibold text-blue-950">
          Tags
          <input
            autoComplete="off"
            className="mt-1.5 min-h-12 w-full rounded-xl border border-blue-200 bg-blue-50/30 px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            name="tag"
            onChange={(event) => setTag(event.currentTarget.value)}
            placeholder="e.g. Work, Ideas"
            required
            type="text"
            value={tag}
          />
        </label>

        <NoteEditor
          label="Note"
          name="body"
          onChange={setBody}
          required
          value={body}
        />

        {state.error && (
          <p aria-live="polite" className="text-sm text-red-700" role="alert">
            {state.error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="min-h-12 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Saving..." : "Save note"}
          </button>
          {state.success && !isPending && (
            <SuccessMessage
              key={state.successAt}
              message={state.success}
            />
          )}
        </div>
      </form>
    </section>
  );
}
