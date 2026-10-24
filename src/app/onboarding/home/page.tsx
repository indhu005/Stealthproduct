"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { Button } from "@/components/ui/Button";
import { FIRST_PAYDAY, MANAGER, HR_CONTACT, START_DATE } from "@/lib/onboarding/data";

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
  const router = useRouter();
  const { openHelp } = useOnboarding();
  const [active, setActive] = useState<Tab>("home");

  return (
    <div className="relative flex h-full flex-col">
      <OnboardingHeader />
      <div className="flex-1 overflow-y-auto px-5 pb-20">
        {active === "home" ? (
          <>
            <h1 className="mb-4 text-[19px] font-bold tracking-tight text-text">Welcome, Jordan</h1>

            <div className="rounded-2xl bg-accent p-4 text-white">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Next payday</div>
              <div className="mt-1 text-[22px] font-bold">{FIRST_PAYDAY}</div>
              {/* Unknown values show "—", never $0.00 (spec principle) — pay isn't calculable until HR review finishes. */}
              <div className="mt-0.5 text-[12.5px] text-white/80">Estimated pay: &mdash;</div>
            </div>

            <div className="mt-3 rounded-xl border border-success/30 bg-success-soft p-3 text-[12.5px] text-success">
              <span aria-hidden="true">✓</span> Onboarding submitted. HR will review by Nov 2.
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {[
                { label: "First day", value: START_DATE.split(",").slice(0, 2).join(",") },
                { label: "Manager", value: MANAGER },
                { label: "HR contact", value: HR_CONTACT },
                { label: "Time off", value: "—" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-surface p-3">
                  <div className="text-[11px] text-faint">{item.label}</div>
                  <div className="mt-0.5 text-[13px] font-semibold text-text">{item.value}</div>
                </div>
              ))}
            </div>

            <Button variant="secondary" className="mt-4 w-full" onClick={() => router.push("/onboarding/review")}>
              Review my onboarding
            </Button>
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
