import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ResetPasswordForm from "./form";

async function ResetPasswordContent() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Unable to verify password reset session", {
      code: error.code,
      status: error.status,
    });
    throw new Error("Unable to verify your password reset session.");
  }

  if (!user) {
    redirect("/login");
  }

  return <ResetPasswordForm />;
}

function ResetPasswordFallback() {
  return (
    <main
      aria-busy="true"
      className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-zinc-50 to-indigo-50 px-4 py-10 sm:px-6"
    >
      <div className="h-80 w-full max-w-lg animate-pulse rounded-3xl bg-white shadow-xl shadow-blue-950/5" />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
