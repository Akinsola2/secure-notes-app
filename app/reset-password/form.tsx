"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  updatePassword,
  type PasswordUpdateState,
} from "./actions";

export default function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState<
    PasswordUpdateState,
    FormData
  >(updatePassword, {});

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-zinc-50 to-indigo-50 px-4 py-10 sm:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-9">
        <p className="text-sm font-semibold text-blue-800">Secure Notes</p>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Choose a new password
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Use at least 8 characters for your new password.
        </p>

        {state.success ? (
          <div className="mt-6 space-y-4">
            <p
              aria-live="polite"
              className="rounded-xl border border-green-200 bg-green-50 px-3.5 py-3 text-sm text-green-800"
              role="status"
            >
              {state.success}
            </p>
            <Link
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              href="/"
            >
              Continue to your notes
            </Link>
          </div>
        ) : (
          <form action={formAction} className="mt-6 space-y-4">
            <label
              className="block text-sm font-medium text-zinc-800"
              htmlFor="new-password"
            >
              New password
              <input
                autoComplete="new-password"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-3 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                id="new-password"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </label>
            <label
              className="block text-sm font-medium text-zinc-800"
              htmlFor="confirm-new-password"
            >
              Confirm new password
              <input
                autoComplete="new-password"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-3 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                id="confirm-new-password"
                minLength={8}
                name="confirmPassword"
                required
                type="password"
              />
            </label>

            {state.error && (
              <p
                aria-live="polite"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
                role="alert"
              >
                {state.error}
              </p>
            )}

            <button
              className="min-h-12 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60"
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Updating password..." : "Update password"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
