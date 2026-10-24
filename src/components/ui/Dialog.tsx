"use client";

import { useEffect, useRef } from "react";

// Reserved for risky confirmations — per the design system, a dialog only
// interrupts for the default-withholding escape hatch, never for routine steps.
export function Dialog({
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.querySelector<HTMLElement>("button, [href], input")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] rounded-2xl border border-border bg-surface p-5 shadow-card"
      >
        <h3 id="dialog-title" className="text-[15px] font-bold tracking-tight">
          {title}
        </h3>
        <div className="mt-2 text-[13px] leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}
