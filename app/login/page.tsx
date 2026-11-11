"use client";

import { useActionState } from "react";
import { login, signup } from "./actions";

const initialState: { error?: string; notice?: string } = {};

export default function LoginPage() {
  const [loginState, loginAction, isLoggingIn] = useActionState(
    login,
    initialState,
  );
  const [signupState, signupAction, isSigningUp] = useActionState(
    signup,
    initialState,
  );

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-5 py-12">
      <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Log in to see your private notes.
          </p>
          <form action={loginAction} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-zinc-800">
              Email
              <input
                autoComplete="email"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="email"
                required
                type="email"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800">
              Password
              <input
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="password"
                required
                type="password"
              />
            </label>
            {loginState.error && (
              <p aria-live="polite" className="text-sm text-red-700">
                {loginState.error}
              </p>
            )}
            <button
              className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
              disabled={isLoggingIn}
              type="submit"
            >
              {isLoggingIn ? "Logging in..." : "Log in"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Sign up with your email and a password of at least 8 characters.
          </p>
          <form action={signupAction} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-zinc-800">
              Email
              <input
                autoComplete="email"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="email"
                required
                type="email"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800">
              Password
              <input
                autoComplete="new-password"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </label>
            {signupState.error && (
              <p aria-live="polite" className="text-sm text-red-700">
                {signupState.error}
              </p>
            )}
            {signupState.notice && (
              <p aria-live="polite" className="text-sm text-green-700">
                {signupState.notice}
              </p>
            )}
            <button
              className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              disabled={isSigningUp}
              type="submit"
            >
              {isSigningUp ? "Creating account..." : "Sign up"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
