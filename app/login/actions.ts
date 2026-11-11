"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AuthFormState = {
  error?: string;
  notice?: string;
};

function getCredentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string"
  ) {
    return null;
  }

  return { email: email.trim(), password };
}

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = getCredentials(formData);
  if (!credentials) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return { error: "Wrong email or password." };
  }

  redirect("/");
}

export async function signup(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = getCredentials(formData);
  if (!credentials) {
    return { error: "Enter a valid email and password." };
  }

  if (credentials.password.length < 8) {
    return { error: "Your password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    return { error: "Unable to create an account with those details." };
  }

  if (data.session) {
    redirect("/");
  }

  return {
    notice: "Account created. Check your email to finish signing up.",
  };
}
