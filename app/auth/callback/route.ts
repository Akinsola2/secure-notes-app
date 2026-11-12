import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const callbackUrl = new URL(request.url);
  const isPasswordReset =
    callbackUrl.searchParams.get("next") === "/reset-password";
  const code = callbackUrl.searchParams.get("code");

  if (!code) {
    console.error("Supabase auth callback did not include an authorization code");
    return redirectWithError(callbackUrl, isPasswordReset);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase auth callback failed", {
      code: error.code,
      status: error.status,
    });
    return redirectWithError(callbackUrl, isPasswordReset);
  }

  const response = NextResponse.redirect(
    new URL(isPasswordReset ? "/reset-password" : "/", callbackUrl.origin),
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function redirectWithError(
  callbackUrl: URL,
  isPasswordReset: boolean,
) {
  const errorPath = isPasswordReset
    ? "/forgot-password?resetError=1"
    : "/login?authError=google";
  const response = NextResponse.redirect(
    new URL(errorPath, callbackUrl.origin),
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}
