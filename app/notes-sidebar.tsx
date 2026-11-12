import Link from "next/link";

type NotesSidebarProps = {
  activePage: "write" | "collection";
};

const navigation = [
  { href: "/", label: "Write a note", page: "write" },
  { href: "/notes", label: "Your collection", page: "collection" },
] as const;

export default function NotesSidebar({
  activePage,
}: NotesSidebarProps) {
  return (
    <aside className="h-fit rounded-2xl border border-blue-100 bg-white/80 p-3 shadow-sm shadow-blue-950/5 backdrop-blur lg:sticky lg:top-6">
      <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Workspace
      </p>
      <nav
        aria-label="Workspace navigation"
        className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1"
      >
        {navigation.map(({ href, label, page }) => {
          const isActive = page === activePage;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                isActive
                  ? "bg-blue-700 text-white shadow-sm shadow-blue-700/20"
                  : "text-blue-900 hover:bg-blue-50"
              }`}
              href={href}
              key={page}
            >
              {page === "write" ? (
                <svg
                  aria-hidden="true"
                  className="size-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className="size-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 4.75h14a1.75 1.75 0 0 1 1.75 1.75v11A1.75 1.75 0 0 1 19 19.25H5a1.75 1.75 0 0 1-1.75-1.75v-11A1.75 1.75 0 0 1 5 4.75Z" />
                  <path d="M7.5 8h9M7.5 12h9M7.5 16h5" />
                </svg>
              )}
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
