"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type PasswordResetState = {
  error?: string;
  success?: string;
};

export async function requestPasswordReset(
  _previousState: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const email = formData.get("email");

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return { error: "Enter a valid email address." };
  }

  const origin = (await headers()).get("origin");
  if (!origin) {
    return {
      error: "Unable to prepare a reset link. Please try again.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: new URL(
      "/auth/callback?next=%2Freset-password",
      origin,
    ).toString(),
  });

  if (error) {
    console.error("Supabase password reset request failed", {
      code: error.code,
      status: error.status,
    });
    return {
      error: "Unable to send a password reset email. Please try again later.",
    };
  }

  return {
    success:
      "If an account exists for that email, a password reset link has been sent.",
  };
}
