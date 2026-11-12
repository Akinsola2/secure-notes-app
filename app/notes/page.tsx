import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AccountFallback, AccountHeader } from "@/app/account-header";
import NotesSidebar from "@/app/notes-sidebar";
import NotesWorkspace, { type Note } from "@/app/notes-workspace";

function NotesFallback() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div className="h-12 w-40 animate-pulse rounded-xl bg-blue-100" />
      <div className="h-12 w-56 animate-pulse rounded-xl bg-blue-100" />
      <div className="h-64 animate-pulse rounded-3xl bg-blue-100" />
    </div>
  );
}

async function NotesCollection() {
  await connection();

  const supabase = await createClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, body, tag, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load notes", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    const tagColumnMissing =
      error.message.toLowerCase().includes("tag") &&
      (error.code === "42703" || error.code === "PGRST204");

    return (
      <p
        className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900"
        role="alert"
      >
        {tagColumnMissing
          ? "Your notes database needs an update. Run db/migrations/20261112_add_note_tags.sql in the Supabase SQL Editor, then refresh this page."
          : "Unable to load your notes right now. Refresh the page to try again."}
      </p>
    );
  }

  const collection: Note[] = notes.map((note) => ({
    id: note.id,
    title: note.title,
    body: note.body,
    tag: note.tag,
    created_at: note.created_at,
  }));

  return <NotesWorkspace notes={collection} />;
}

export default function NotesPage() {
  return (
    <main className="min-h-full flex-1 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 px-4 py-7 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <Suspense fallback={<AccountFallback />}>
          <AccountHeader />
        </Suspense>
        <div className="grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <NotesSidebar activePage="collection" />
          <section className="min-w-0">
            <Suspense fallback={<NotesFallback />}>
              <NotesCollection />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
