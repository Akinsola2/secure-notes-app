"use server";

import { createClient } from "@/lib/supabase/server";

export type PasswordUpdateState = {
  error?: string;
  success?: string;
};

export async function updatePassword(
  _previousState: PasswordUpdateState,
  formData: FormData,
): Promise<PasswordUpdateState> {
  const password = formData.get("password");
  const confirmation = formData.get("confirmPassword");

  if (typeof password !== "string" || password.length < 8) {
    return { error: "Your password must be at least 8 characters." };
  }

  if (typeof confirmation !== "string" || confirmation !== password) {
    return { error: "Your passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Unable to verify password reset session", {
      code: authError.code,
      status: authError.status,
    });
    return {
      error: "Your reset session may have expired. Request a new reset link.",
    };
  }

  if (!user) {
    return {
      error: "Your reset session has expired. Request a new reset link.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("Supabase password update failed", {
      code: error.code,
      status: error.status,
    });
    return { error: "Unable to update your password. Please try again." };
  }

  return { success: "Your password has been updated." };
}
