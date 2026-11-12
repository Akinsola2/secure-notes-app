import { connection } from "next/server";

function FooterContent({ year }: { year?: number }) {
  return (
    <footer className="mt-auto border-t border-blue-100 bg-white/80 px-4 py-5 text-center text-sm text-slate-600">
      <p>
        Secure Notes
        {year !== undefined && (
          <>
            {" "}
            <span aria-hidden="true">©</span> {year}
          </>
        )}
      </p>
    </footer>
  );
}

export function AppFooterFallback() {
  return <FooterContent />;
}

export default async function AppFooter() {
  await connection();
  return <FooterContent year={new Date().getFullYear()} />;
}
