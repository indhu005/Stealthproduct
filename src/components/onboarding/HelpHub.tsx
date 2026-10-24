"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "./OnboardingProvider";
import { getFieldHelp } from "@/lib/onboarding/ai";
import { HR_CONTACT } from "@/lib/onboarding/data";
import { SparkleIcon } from "./ui";

const quickQuestions = ["What is a W-4?", "When is my first payday?", "What if I don't have a bank account?"];

function answerFor(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("w-4") || q.includes("withholding")) {
    return "A W-4 tells your employer how much federal income tax to withhold from your paycheck. It's based on your filing status and any extra withholding you choose.";
  }
  if (q.includes("payday") || q.includes("pay day") || q.includes("paid")) {
    return "Your first payday is Friday, Nov 13, 2026 — covering your first days on the job starting Monday, Nov 2.";
  }
  if (q.includes("bank") || q.includes("deposit")) {
    return "If you don't have a bank account yet, the Direct deposit step offers alternatives like a paper check or a pay card.";
  }
  return "I'm not sure about this one. Ask HR — Priya Shah can help directly.";
}

export function HelpHub() {
  const { state, closeHelp, setTourOpen } = useOnboarding();
  const router = useRouter();
  const { helpOpen, helpContext } = state;
  const panelRef = useRef<HTMLDivElement>(null);
  const [asked, setAsked] = useState(false);
  const [genericQ, setGenericQ] = useState<{ q: string; a: string } | null>(null);

  useEffect(() => {
    if (!helpOpen) {
      setAsked(false);
      setGenericQ(null);
      return;
    }
    panelRef.current?.querySelector<HTMLElement>("button, input")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeHelp();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [helpOpen, closeHelp]);

  const fieldHelp = helpContext?.fieldId ? getFieldHelp(helpContext.fieldId) : null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Help"
      aria-hidden={!helpOpen}
      className={`absolute inset-x-0 bottom-0 z-40 flex max-h-[80%] flex-col rounded-t-[24px] border-t border-border bg-surface shadow-card transition-transform duration-200 ease-out motion-reduce:transition-none ${
        helpOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-border" aria-hidden="true" />
      <div className="flex shrink-0 items-center justify-between p-4 pb-2">
        <h2 className="text-[15px] font-bold tracking-tight">{fieldHelp ? fieldHelp.label : "Help"}</h2>
        <button
          onClick={closeHelp}
          aria-label="Close help"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {fieldHelp ? (
          <>
            <div className="mb-3 rounded-xl border border-accent-soft-border bg-accent-soft/40 p-3">
              <div className="text-[12.5px] font-bold text-text">What it means</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-text">{fieldHelp.explain}</p>
              {fieldHelp.example && (
                <>
                  <div className="mt-2 text-[12.5px] font-bold text-text">Example</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{fieldHelp.example}</p>
                </>
              )}
            </div>

            {asked && fieldHelp.askAnswer && (
              <div className="mb-3 rounded-xl border border-border p-3">
                <p className="text-[12.5px] leading-relaxed text-text">
                  {fieldHelp.askAnswer}
                  {fieldHelp.source && (
                    <>
                      {" "}
                      <span className="font-semibold text-accent-ink underline">Source: {fieldHelp.source}</span>
                    </>
                  )}
                </p>
              </div>
            )}

            {fieldHelp.disclaimer && <p className="mb-3 text-[11.5px] text-faint">{fieldHelp.disclaimer}</p>}

            {!asked && fieldHelp.askAnswer ? (
              <button
                onClick={() => setAsked(true)}
                className="mb-3 w-full rounded-lg bg-accent px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-accent-hover"
              >
                Ask about this step
              </button>
            ) : (
              <div className="mb-3 flex gap-2">
                <button
                  onClick={closeHelp}
                  className="flex-1 rounded-lg border border-border py-2 text-[12.5px] font-semibold text-text hover:bg-surface-sunken"
                >
                  Contact HR
                </button>
                <button
                  onClick={closeHelp}
                  className="flex-1 rounded-lg border border-border py-2 text-[12.5px] font-semibold text-text hover:bg-surface-sunken"
                >
                  Back to form
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {genericQ ? (
              <div className="mb-3 rounded-xl border border-border p-3">
                <span className="inline-block rounded-md bg-accent-soft px-2 py-1 text-[12px] font-semibold text-accent-ink">
                  {genericQ.q}
                </span>
                <p className="mt-2 text-[12.5px] leading-relaxed text-text">{genericQ.a}</p>
                <button onClick={() => setGenericQ(null)} className="mt-2 text-[12px] font-semibold text-accent-ink hover:underline">
                  Ask another question
                </button>
              </div>
            ) : (
              <div className="mb-3 flex flex-col gap-1.5">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-ink">
                  <SparkleIcon />
                  Ask a question
                </div>
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setGenericQ({ q, a: answerFor(q) })}
                    className="rounded-lg border border-border px-3 py-2 text-left text-[12.5px] text-text hover:bg-surface-sunken"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={closeHelp}
              className="mb-2 w-full rounded-lg border border-border py-2 text-[12.5px] font-semibold text-text hover:bg-surface-sunken"
            >
              Contact HR — {HR_CONTACT}
            </button>
            <button
              onClick={() => {
                closeHelp();
                setTourOpen(true);
                router.push("/onboarding/home");
              }}
              className="w-full text-center text-[12px] font-semibold text-accent-ink hover:underline"
            >
              Replay the 1-minute tour
            </button>
          </>
        )}
      </div>
    </div>
  );
}
