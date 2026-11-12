import Link from "next/link";

export default function NoteNotFound() {
  return (
    <main className="min-h-full flex-1 bg-stone-50 px-4 py-7 sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-950">
          Note not found
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          This note may have been deleted or is not available to your account.
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          href="/"
        >
          Back to my notes
        </Link>
      </section>
    </main>
  );
}
