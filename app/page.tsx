import { Suspense } from "react";
import NewNoteForm from "./new-note-form";
import NotesSidebar from "./notes-sidebar";
import { AccountFallback, AccountHeader } from "./account-header";

export default function Home() {
  return (
    <main className="min-h-full flex-1 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 px-4 py-7 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <Suspense fallback={<AccountFallback />}>
          <AccountHeader />
        </Suspense>
        <div className="grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <NotesSidebar activePage="write" />
          <section className="min-w-0">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                Your private workspace
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-blue-950 sm:text-4xl">
                Write a note
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Give your ideas a safe place to land.
              </p>
            </div>
            <NewNoteForm />
          </section>
        </div>
      </div>
    </main>
  );
}
