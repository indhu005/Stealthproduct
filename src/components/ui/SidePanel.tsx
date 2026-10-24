"use client";

import { useEffect, useRef } from "react";

// Non-modal by design — the design system calls for the table to stay visible
// behind it, so this has no darkening backdrop (unlike Dialog).
export function SidePanel({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button, [href], input")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      role="complementary"
      aria-label={title}
      aria-hidden={!open}
      className={`fixed top-0 right-0 z-30 flex h-full w-[380px] max-w-[90vw] flex-col border-l border-border bg-surface shadow-card transition-transform duration-200 ease-out motion-reduce:transition-none ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
        <h3 className="text-[15px] font-bold tracking-tight">{title}</h3>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto p-4">{children}</div>
    </div>
  );
}
