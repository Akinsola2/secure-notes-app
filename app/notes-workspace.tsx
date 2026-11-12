"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import DeleteNoteButton from "./delete-note-button";
import NoteContent from "./note-content";

export type Note = {
  id: number;
  title: string;
  body: string;
  tag: string;
  created_at: string;
};

export default function NotesWorkspace({ notes }: { notes: Note[] }) {
  const [search, setSearch] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const filteredNotes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter(
      (note) =>
        note.title.toLocaleLowerCase().includes(query) ||
        note.tag.toLocaleLowerCase().includes(query),
    );
  }, [notes, search]);

  return (
    <>
      <button
        aria-label={`${notes.length} ${notes.length === 1 ? "note" : "notes"} saved. Focus search.`}
        className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        onClick={() => searchInput.current?.focus()}
        type="button"
      >
        <span className="text-lg tabular-nums">{notes.length}</span>
        {notes.length === 1 ? "note saved" : "notes saved"}
      </button>

      <section aria-labelledby="page-title" className="mb-6">
        <h1
          className="text-3xl font-semibold tracking-tight text-blue-950 sm:text-4xl"
          id="page-title"
        >
          Your collection
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A private place for the details you want to remember.
        </p>
      </section>

      <section aria-labelledby="notes-heading">
        <h2 className="sr-only" id="notes-heading">
          Saved notes
        </h2>
        <label className="mb-4 block text-sm font-bold text-blue-950">
          Search
          <input
            autoComplete="off"
            className="mt-1.5 min-h-12 w-full rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            name="search"
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search note titles and tags..."
            ref={searchInput}
            type="search"
            value={search}
          />
        </label>

        {search.trim() && filteredNotes.length > 0 && (
          <ul
            aria-label="Matching note titles and tags"
            className="mb-4 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm shadow-blue-950/5"
          >
            {filteredNotes.map((note) => (
              <li
                className="border-b border-blue-50 last:border-b-0"
                key={note.id}
              >
                <Link
                  className="flex min-h-12 items-center justify-between gap-4 px-4 py-3 text-sm transition hover:bg-blue-50 focus-visible:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700"
                  href={`/notes/${note.id}`}
                >
                  <span className="truncate font-medium text-blue-950">
                    {note.title}
                  </span>
                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-800">
                    {note.tag || "No tag"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {filteredNotes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-blue-200 bg-white/70 px-5 py-10 text-center text-sm text-slate-600">
            {notes.length === 0
              ? "No notes yet. Create your first note from the sidebar."
              : "No notes match your search."}
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredNotes.map((note) => (
              <li
                className="rounded-2xl border border-blue-100 bg-white p-5 shadow-md shadow-blue-950/5 sm:p-6"
                key={note.id}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="break-words text-base font-semibold text-blue-950">
                    {note.title}
                  </h3>
                  <time
                    className="shrink-0 text-xs text-slate-500"
                    dateTime={note.created_at}
                  >
                    {new Date(note.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                {note.tag && (
                  <p className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
                    {note.tag}
                  </p>
                )}
                {note.body && (
                  <div className="mt-3 text-sm text-slate-700">
                    <NoteContent body={note.body} />
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    className="inline-flex min-h-10 items-center rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    href={`/notes/${note.id}`}
                  >
                    Edit
                  </Link>
                  <DeleteNoteButton noteId={String(note.id)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
