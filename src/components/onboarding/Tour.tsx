"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useOnboarding } from "./OnboardingProvider";

const steps = [
  { id: "home", label: "Home", text: "Your tasks and next payday live here." },
  { id: "pay", label: "Pay", text: "Find your paystubs and see how your pay is calculated." },
  { id: "timeoff", label: "Time off", text: "Request time off and see your balance." },
  { id: "benefits", label: "Benefits", text: "Review or change your coverage." },
  { id: "help", label: "Help", text: "Search guides or ask a question anytime." },
] as const;

// The tour only has something real to point at on the employee home stub —
// if tourOpen is true anywhere else (e.g. mid-navigation) it simply doesn't
// render, which also satisfies "never blocks the page if the user skips."
export function OnboardingTour() {
  const { state, setTourOpen, markTourSeen } = useOnboarding();
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const active = state.tourOpen && pathname === "/onboarding/home";

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    tooltipRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") markTourSeen();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, index, markTourSeen]);

  if (!active) return null;

  const step = steps[index];
  const targetIndex = ["home", "pay", "timeoff", "benefits", "help"].indexOf(step.id);
  const tabCount = 5;

  return (
    <div className="absolute inset-0 z-40" aria-hidden={false}>
      <div className="absolute inset-0 bg-black/55 motion-reduce:transition-none" onClick={() => markTourSeen()} />

      {/* Highlight ring over the current tab — sits above the dim overlay in
          z-order so it reads as "spotlighted" without needing a true CSS
          cutout mask. */}
      <div
        className="pointer-events-none absolute bottom-0 z-50 h-[60px] rounded-xl ring-2 ring-accent transition-all duration-200 motion-reduce:transition-none"
        style={{ left: `${(targetIndex / tabCount) * 100}%`, width: `${100 / tabCount}%` }}
      />

      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${index + 1} of ${steps.length}: ${step.label}`}
        tabIndex={-1}
        className="absolute inset-x-5 z-50 rounded-2xl border border-border bg-surface p-4 shadow-card"
        style={{ bottom: 76 }}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">
            Step {index + 1} of {steps.length}
          </span>
          <button onClick={markTourSeen} className="text-[11.5px] font-semibold text-faint hover:underline">
            Skip
          </button>
        </div>
        <div className="text-[13.5px] font-bold text-text">{step.label}</div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{step.text}</p>
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            className="text-[12.5px] font-semibold text-accent-ink disabled:opacity-40"
          >
            Back
          </button>
          {index < steps.length - 1 ? (
            <button onClick={() => setIndex((i) => i + 1)} className="rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-accent-hover">
              Next
            </button>
          ) : (
            <button onClick={markTourSeen} className="rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-accent-hover">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
