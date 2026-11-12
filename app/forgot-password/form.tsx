"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordReset,
  type PasswordResetState,
} from "./actions";

export default function ForgotPasswordForm({
  initialError = false,
}: {
  initialError?: boolean;
}) {
  const [state, formAction, isPending] = useActionState<
    PasswordResetState,
    FormData
  >(requestPasswordReset, {});

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-zinc-50 to-indigo-50 px-4 py-10 sm:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-9">
        <p className="text-sm font-semibold text-blue-800">Secure Notes</p>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Reset your password
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Enter your email address and we’ll send you a link to choose a new
          password.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <label
            className="block text-sm font-medium text-zinc-800"
            htmlFor="reset-email"
          >
            Email address
            <input
              autoComplete="email"
              className="mt-1.5 min-h-12 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-3 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              id="reset-email"
              name="email"
              placeholder="securenoteapp@gmail.com"
              required
              type="email"
            />
          </label>

          {!state.success && (initialError || state.error) && (
            <p
              aria-live="polite"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              role="alert"
            >
              {state.error ??
                "That reset link could not be verified. Request a new one."}
            </p>
          )}
          {state.success && (
            <p
              aria-live="polite"
              className="rounded-xl border border-green-200 bg-green-50 px-3.5 py-3 text-sm text-green-800"
              role="status"
            >
              {state.success}
            </p>
          )}

          <button
            className="min-h-12 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link
            className="font-semibold text-blue-700 underline-offset-4 hover:text-blue-900 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-blue-700"
            href="/login"
          >
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}
