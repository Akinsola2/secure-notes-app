"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error?: string;
};

function getCredentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return null;
  }

  return { email: email.trim(), password };
}

export async function logIn(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = getCredentials(formData);
  if (!credentials) {
    return { error: "Wrong email or password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return { error: "Wrong email or password." };
  }

  redirect("/");
}

export async function signInWithGoogle(): Promise<AuthFormState> {
  const origin = (await headers()).get("origin");
  if (!origin) {
    return { error: "Unable to start Google sign-in. Please try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: new URL("/auth/callback", origin).toString(),
    },
  });

  if (error || !data.url) {
    console.error("Supabase Google sign-in failed", {
      code: error?.code,
      status: error?.status,
    });
    return {
      error: "Unable to start Google sign-in. Please try again.",
    };
  }

  redirect(data.url);
}

export async function signUp(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const credentials = getCredentials(formData);
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof firstName !== "string" ||
    firstName.trim().length === 0 ||
    typeof lastName !== "string" ||
    lastName.trim().length === 0
  ) {
    return { error: "Enter your first and last name." };
  }

  if (!credentials) {
    return {
      error: "Enter a valid email and a password of at least 8 characters.",
    };
  }

  if (
    typeof confirmPassword !== "string" ||
    credentials.password !== confirmPassword
  ) {
    return { error: "Your passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    ...credentials,
    options: {
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      },
    },
  });

  if (error) {
    console.error("Supabase sign-up failed", {
      code: error.code,
      status: error.status,
    });

    if (error.status === 401) {
      return {
        error:
          "Supabase rejected the project key. Check that the URL and publishable key in .env.local belong to the same project.",
      };
    }

    return { error: "Unable to create an account with those details." };
  }

  redirect("/");
}
