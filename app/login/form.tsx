"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { logIn, signInWithGoogle, signUp } from "./actions";

const initialState: { error?: string } = {};
const rememberedEmailKey = "secure-notes.remembered-email";
type Mode = "login" | "signup";
type IconName = "user" | "mail" | "lock" | "eye" | "eyeOff";

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {name === "user" && (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </>
      )}
      {name === "mail" && (
        <>
          <rect height="16" rx="2" width="20" x="2" y="4" />
          <path d="m22 7-10 6L2 7" />
        </>
      )}
      {name === "lock" && (
        <>
          <rect height="11" rx="2" width="16" x="4" y="10" />
          <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" />
        </>
      )}
      {name === "eye" && (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
      {name === "eyeOff" && (
        <>
          <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a15.7 15.7 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10.7 10.7 0 0 0 3-.4" />
        </>
      )}
    </svg>
  );
}

function PasswordField({
  autoComplete,
  label,
  name,
  onToggle,
  placeholder,
  visible,
}: {
  autoComplete: string;
  label: string;
  name: string;
  onToggle: () => void;
  placeholder: string;
  visible: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-zinc-800" htmlFor={name}>
      {label}
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
          <Icon name="lock" />
        </span>
        <input
          autoComplete={autoComplete}
          className="min-h-12 w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-12 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          id={name}
          minLength={8}
          name={name}
          placeholder={placeholder}
          required
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-2 flex items-center rounded-lg px-2 text-zinc-500 transition hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-blue-600"
          onClick={onToggle}
          type="button"
        >
          <Icon name={visible ? "eyeOff" : "eye"} />
        </button>
      </span>
    </label>
  );
}

export default function LoginForm({
  initialGoogleError = false,
}: {
  initialGoogleError?: boolean;
} = {}) {
  const [loginState, loginAction, isLoggingIn] = useActionState(
    logIn,
    initialState,
  );
  const [googleState, googleAction, isSigningInWithGoogle] = useActionState(
    signInWithGoogle,
    initialState,
  );
  const [signupState, signupAction, isSigningUp] = useActionState(
    signUp,
    initialState,
  );
  const [mode, setMode] = useState<Mode>("login");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [rememberEmailError, setRememberEmailError] = useState<string>();
  const emailInput = useRef<HTMLInputElement>(null);
  const rememberEmailInput = useRef<HTMLInputElement>(null);
  const isSignup = mode === "signup";
  const error = isSignup
    ? signupState.error
    : (googleState.error ??
      loginState.error ??
      (initialGoogleError
        ? "Google sign-in couldn't be completed. Try again or use email and password."
        : undefined));
  const isPending = isLoggingIn || isSigningUp || isSigningInWithGoogle;

  useEffect(() => {
    if (isSignup) {
      return;
    }

    try {
      const savedEmail = window.localStorage.getItem(rememberedEmailKey);
      if (emailInput.current) {
        emailInput.current.value = savedEmail ?? "";
      }
      if (rememberEmailInput.current) {
        rememberEmailInput.current.checked = Boolean(savedEmail);
      }
    } catch (storageError) {
      console.error("Unable to read remembered email", storageError);
    }
  }, [isSignup]);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setPasswordVisible(false);
    setConfirmPasswordVisible(false);
  }

  function saveRememberedEmail(email: string | null) {
    try {
      if (email) {
        window.localStorage.setItem(rememberedEmailKey, email);
      } else {
        window.localStorage.removeItem(rememberedEmailKey);
      }
      setRememberEmailError(undefined);
    } catch (storageError) {
      console.error("Unable to save remembered email", storageError);
      setRememberEmailError("Your browser couldn't save the email.");
    }
  }

  function handleEmailFormSubmit(event: FormEvent<HTMLFormElement>) {
    if (isSignup) {
      return;
    }

    const email = new FormData(event.currentTarget).get("email");
    saveRememberedEmail(
      rememberEmailInput.current?.checked &&
        typeof email === "string" &&
        email.trim()
        ? email.trim()
        : null,
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-zinc-50 to-indigo-50 px-4 py-10 sm:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-9">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-md shadow-blue-700/20">
            <Icon name="lock" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800">Secure Notes</p>
            <p className="text-xs text-zinc-500">
              A private space for your notes
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          {isSignup ? "Create your notes space" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {isSignup
            ? "Create a private space for the notes you want to keep."
            : "Log in to continue to your notes."}
        </p>

        {!isSignup && (
          <>
            <form action={googleAction} className="mt-6">
              <button
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-semibold text-zinc-800 transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60"
                disabled={isPending}
                type="submit"
              >
                <span
                  aria-hidden="true"
                  className="grid size-6 place-items-center rounded-full border border-blue-100 font-bold text-blue-700"
                >
                  G
                </span>
                {isSigningInWithGoogle
                  ? "Connecting to Google..."
                  : "Continue with Google"}
              </button>
            </form>
            <div className="my-6 flex items-center gap-3">
              <span aria-hidden="true" className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Or continue with email
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-zinc-200" />
            </div>
          </>
        )}

        <form
          action={isSignup ? signupAction : loginAction}
          className={`${isSignup ? "mt-6 " : ""}space-y-4`}
          key={mode}
          noValidate={!isSignup}
          onSubmit={handleEmailFormSubmit}
        >
          {isSignup && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label
                className="block text-sm font-medium text-zinc-800"
                htmlFor="firstName"
              >
                First name
                <span className="relative mt-1.5 block">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    <Icon name="user" />
                  </span>
                  <input
                    autoComplete="given-name"
                    className="min-h-12 w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-3 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    required
                    type="text"
                  />
                </span>
              </label>
              <label
                className="block text-sm font-medium text-zinc-800"
                htmlFor="lastName"
              >
                Last name
                <span className="relative mt-1.5 block">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    <Icon name="user" />
                  </span>
                  <input
                    autoComplete="family-name"
                    className="min-h-12 w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-3 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    required
                    type="text"
                  />
                </span>
              </label>
            </div>
          )}

          <label
            className="block text-sm font-medium text-zinc-800"
            htmlFor="email"
          >
            Email address
            <span className="relative mt-1.5 block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                <Icon name="mail" />
              </span>
              <input
                autoComplete="email"
                className="min-h-12 w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-3 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                id="email"
                name="email"
                placeholder="securenoteapp@gmail.com"
                ref={emailInput}
                required
                type="email"
              />
            </span>
          </label>

          <PasswordField
            autoComplete={isSignup ? "new-password" : "current-password"}
            label="Password"
            name="password"
            onToggle={() => setPasswordVisible((visible) => !visible)}
            placeholder="at least 8 characters"
            visible={passwordVisible}
          />

          {!isSignup && (
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input
                    className="size-4 rounded border-zinc-300 accent-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    defaultChecked={false}
                    onChange={(event) => {
                      if (!event.target.checked) {
                        saveRememberedEmail(null);
                      }
                    }}
                    ref={rememberEmailInput}
                    type="checkbox"
                  />
                  Remember my email on this device
                </label>
                <Link
                  className="text-sm font-semibold text-blue-700 underline-offset-4 hover:text-blue-900 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-blue-700"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
              <p className="pl-6 text-xs leading-5 text-zinc-500">
                Your browser can offer to save your password; this app never
                stores it.
              </p>
              {rememberEmailError && (
                <p aria-live="polite" className="pl-6 text-xs text-amber-700">
                  {rememberEmailError}
                </p>
              )}
            </div>
          )}

          {isSignup && (
            <PasswordField
              autoComplete="new-password"
              label="Confirm password"
              name="confirmPassword"
              onToggle={() => setConfirmPasswordVisible((visible) => !visible)}
              placeholder="Confirm your password"
              visible={confirmPasswordVisible}
            />
          )}

          {error && (
            <p
              aria-live="polite"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            className="min-h-12 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending
              ? isSignup
                ? "Creating your notes..."
                : "Logging in..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          {isSignup ? "Have an account?" : "New here?"}{" "}
          <button
            className="font-semibold text-blue-700 underline-offset-4 hover:text-blue-900 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-blue-700"
            disabled={isPending}
            onClick={() => switchMode(isSignup ? "login" : "signup")}
            type="button"
          >
            {isSignup ? "Log in" : "Create account"}
          </button>
        </p>
      </section>
    </main>
  );
}
