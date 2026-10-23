"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") as "light" | "dark" | null);
  }, []);

  function toggle() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = document.documentElement.getAttribute("data-theme") ?? (prefersDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      {theme === "dark" ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 1.5V3M8 13V14.5M14.5 8H13M3 8H1.5M12.5 3.5L11.4 4.6M4.6 11.4L3.5 12.5M12.5 12.5L11.4 11.4M4.6 4.6L3.5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 9.5A6 6 0 1 1 6.5 2.5A5 5 0 0 0 13.5 9.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
