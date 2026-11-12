"use client";

import { useEffect, useState } from "react";

export default function SuccessMessage({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsVisible(false), 3000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <p
      aria-live="polite"
      className="text-sm font-semibold text-blue-800"
      role="status"
    >
      {message}
    </p>
  );
}
