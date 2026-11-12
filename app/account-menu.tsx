"use client";

import { useEffect, useRef, useState } from "react";
import { logOut } from "./actions";

export default function AccountMenu({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        aria-controls="account-details"
        aria-expanded={isOpen}
        className="max-w-48 truncate rounded-xl border border-blue-100 bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-950 shadow-sm transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:max-w-64"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {displayName}
      </button>
      {isOpen && (
        <div
          className="absolute right-0 top-full z-10 mt-2 w-64 rounded-2xl border border-blue-100 bg-white p-4 shadow-xl shadow-blue-950/10"
          id="account-details"
        >
          <p className="break-all text-sm text-slate-600">
            {email || "Email unavailable"}
          </p>
          <form action={logOut} className="mt-3 border-t border-blue-50 pt-2">
            <button
              className="w-full rounded-md px-2 py-2 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              type="submit"
            >
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
