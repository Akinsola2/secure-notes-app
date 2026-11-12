import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountFallback, AccountHeader } from "@/app/account-header";
import DeleteNoteButton from "@/app/delete-note-button";
import NotesSidebar from "@/app/notes-sidebar";
import { createClient } from "@/lib/supabase/server";
import EditNoteForm from "./edit-note-form";

async function EditNoteContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: note, error } = await supabase
    .from("notes")
    .select("id, title, body, tag, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load note: ${error.message}`);
  }

  if (!note) {
    notFound();
  }

  return (
    <>
      <Link
        className="mb-5 inline-flex min-h-10 items-center text-sm font-semibold text-blue-800 transition hover:text-blue-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        href="/notes"
      >
        <span aria-hidden="true" className="mr-2">
          ←
        </span>
        Back to collection
      </Link>
      <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
          Refine your note
        </p>
        <h1 className="mt-1 text-xl font-semibold text-blue-950">Edit note</h1>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Update the title, tag or text of your note.
        </p>
        <EditNoteForm
          note={{
            id: String(note.id),
            title: note.title,
            body: note.body,
            tag: note.tag,
          }}
        />
        <div className="mt-6 border-t border-blue-100 pt-5">
          <p className="mb-3 text-sm text-slate-600">
            Or delete this note permanently.
          </p>
          <DeleteNoteButton noteId={String(note.id)} />
        </div>
      </section>
    </>
  );
}

function EditNoteFallback() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div className="h-10 w-40 animate-pulse rounded-lg bg-blue-100" />
      <div className="h-96 animate-pulse rounded-3xl border border-blue-100 bg-white" />
    </div>
  );
}

export default function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-full flex-1 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 px-4 py-7 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <Suspense fallback={<AccountFallback />}>
          <AccountHeader />
        </Suspense>
        <div className="grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <NotesSidebar activePage="collection" />
          <section className="min-w-0">
            <Suspense fallback={<EditNoteFallback />}>
              <EditNoteContent params={params} />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
