import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import AccountMenu from "./account-menu";

export function AccountFallback() {
  return (
    <div
      aria-busy="true"
      className="h-16 animate-pulse rounded-2xl bg-blue-100"
    />
  );
}

export async function AccountHeader() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;
  const signupName = [firstName, lastName]
    .filter(
      (name): name is string =>
        typeof name === "string" && name.trim().length > 0,
    )
    .map((name) => name.trim())
    .join(" ");
  const metadataName =
    user.user_metadata?.full_name ?? user.user_metadata?.name;
  const displayName =
    signupName ||
    (typeof metadataName === "string" && metadataName.trim()) ||
    "Account";

  return (
    <header className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-sm shadow-blue-950/5 backdrop-blur sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-700/20">
          <svg
            aria-hidden="true"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M7 3.75h7l4.25 4.5v12H7z" />
            <path d="M14 4v5h4M10 13h5M10 16.5h5" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-blue-950 sm:text-base">
            Secure Notes
          </p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Your private workspace
          </p>
        </div>
      </div>
      <AccountMenu displayName={displayName} email={user.email ?? ""} />
    </header>
  );
}
