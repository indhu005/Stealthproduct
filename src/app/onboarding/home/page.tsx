"use client";

import { useState } from "react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { FIRST_PAYDAY } from "@/lib/onboarding/data";

type Tab = "home" | "pay" | "timeoff" | "benefits";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "pay", label: "Pay", icon: "$" },
  { id: "timeoff", label: "Time off", icon: "☐" },
  { id: "benefits", label: "Benefits", icon: "♥" },
];

export function tourTabId(id: Tab | "help") {
  return `tour-tab-${id}`;
}

export default function EmployeeHomePage() {
  const { openHelp } = useOnboarding();
  const [active, setActive] = useState<Tab>("home");

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-5 pb-20 pt-3">
        {active === "home" ? (
          <>
            <h1 className="mb-1 text-[19px] font-bold tracking-tight text-text">Welcome, Jordan</h1>
            <p className="mb-4 text-[13px] text-muted">You&rsquo;re all set up at Acme Studio.</p>
            <div className="rounded-2xl border border-border bg-accent-soft p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-ink">Next payday</div>
              <div className="mt-1 text-[20px] font-bold text-text">{FIRST_PAYDAY}</div>
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-border p-3 text-[12.5px] leading-relaxed text-muted">
              This is a concept stub for the post-onboarding home screen — just enough to give the tour below something real to
              point at.
            </div>
          </>
        ) : (
          <div className="mt-10 text-center text-[13px] text-muted">
            {tabs.find((t) => t.id === active)?.label} isn&rsquo;t built out in this concept yet.
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-surface px-2 py-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            id={tourTabId(t.id)}
            onClick={() => setActive(t.id)}
            className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[10.5px] font-semibold ${
              active === t.id ? "text-accent-ink" : "text-faint"
            }`}
          >
            <span aria-hidden="true" className="text-[15px]">
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
        <button
          id={tourTabId("help")}
          onClick={() => openHelp()}
          className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[10.5px] font-semibold text-faint"
        >
          <span aria-hidden="true" className="text-[15px]">
            ?
          </span>
          Help
        </button>
      </div>
    </div>
  );
}
