"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "./OnboardingProvider";
import { getFieldHelp } from "@/lib/onboarding/ai";
import { HR_CONTACT } from "@/lib/onboarding/data";
import { SparkleIcon } from "./ui";

type Category = "Getting paid" | "Taxes" | "Time off" | "Benefits";

const articles: { title: string; category: Category; body: string }[] = [
  { title: "How your pay is calculated", category: "Getting paid", body: "Gross pay minus taxes and any benefit deductions equals your net (take-home) pay. Your first paystub is available after your first payday." },
  { title: "Setting up direct deposit", category: "Getting paid", body: "You'll need your bank's routing number and your account number. Both are on a check or in your bank's app." },
  { title: "What is a W-4?", category: "Taxes", body: "A federal form that tells your employer how much income tax to withhold from each paycheck, based on your filing status and other income." },
  { title: "Texas and state income tax", category: "Taxes", body: "Texas doesn't collect a state income tax, so there's no state withholding form to complete for employees based there." },
  { title: "Requesting time off", category: "Time off", body: "Once you're set up, you can request time off from your home screen. Your manager is notified automatically." },
  { title: "Choosing your benefits", category: "Benefits", body: "You can enroll, waive, or decide later for medical, dental/vision, and 401k. If you decide later, the deadline is Nov 30." },
];

const quickQuestions = [
  "What is a W-4?",
  "When is my first payday?",
  "What if I don't have a bank account?",
];

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
  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState<{ q: string; a: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!helpOpen) {
      setAsked(null);
      setQuery("");
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
  const filteredArticles = activeCategory ? articles.filter((a) => a.category === activeCategory) : articles;
  const searched = query ? filteredArticles.filter((a) => a.title.toLowerCase().includes(query.toLowerCase())) : filteredArticles;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Help"
      aria-hidden={!helpOpen}
      className={`absolute inset-x-0 bottom-0 z-40 flex h-[88%] flex-col rounded-t-[24px] border-t border-border bg-surface shadow-card transition-transform duration-200 ease-out motion-reduce:transition-none ${
        helpOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
        <h2 className="text-[15px] font-bold tracking-tight">Help</h2>
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

      <div className="flex-1 overflow-y-auto p-4">
        {fieldHelp && (
          <div className="mb-4 rounded-xl border border-accent-soft-border bg-accent-soft/40 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[12.5px] font-bold text-accent-ink">
              <SparkleIcon />
              Not sure?
            </div>
            <p className="text-[12.5px] leading-relaxed text-text">{fieldHelp.explain}</p>
            {fieldHelp.example && <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{fieldHelp.example}</p>}
            <p className="mt-2 text-[11.5px] text-faint">This is general information, not tax advice. Your choice is yours to make.</p>
            <div className="mt-2 flex items-center gap-3 text-[12px] font-semibold">
              <button onClick={() => setAsked({ q: "Ask about this step", a: fieldHelp.explain })} className="text-accent-ink hover:underline">
                Ask about this step
              </button>
              <span className="text-faint">&middot; Contact {HR_CONTACT.split(" ")[0]} below</span>
            </div>
          </div>
        )}

        <label htmlFor="help-search" className="mb-1 block text-[12px] font-semibold text-muted">
          Search
        </label>
        <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-border bg-surface-sunken px-2.5 py-2">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0 text-faint" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            id="help-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-text placeholder:text-faint focus:outline-none"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {(["Getting paid", "Taxes", "Time off", "Benefits"] as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(activeCategory === c ? null : c)}
              className={`rounded-full border px-2.5 py-1 text-[11.5px] font-semibold ${
                activeCategory === c ? "border-accent bg-accent-soft text-accent-ink" : "border-border text-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {searched.length === 0 ? (
          <p className="mb-4 text-[12.5px] text-faint">No results. Try different words, or ask a question below.</p>
        ) : (
          <div className="mb-4 flex flex-col gap-2">
            {searched.map((a) => (
              <details key={a.title} className="rounded-lg border border-border p-2.5">
                <summary className="cursor-pointer text-[13px] font-semibold text-text">{a.title}</summary>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{a.body}</p>
              </details>
            ))}
          </div>
        )}

        <div className="mb-4 rounded-xl border border-border p-3">
          <div className="mb-2 text-[12.5px] font-bold text-text">Ask a question</div>
          {asked ? (
            <div>
              <span className="inline-block rounded-md bg-accent-soft px-2 py-1 text-[12px] font-semibold text-accent-ink">{asked.q}</span>
              <p className="mt-2 text-[12.5px] leading-relaxed text-text">{asked.a}</p>
              <p className="mt-1.5 text-[11px] text-faint">Source: scripted help content (concept)</p>
              <button onClick={() => setAsked(null)} className="mt-2 text-[12px] font-semibold text-accent-ink hover:underline">
                Ask another question
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAsked({ q, a: answerFor(q) })}
                    className="rounded-full border border-border px-2.5 py-1 text-left text-[11.5px] text-muted hover:bg-surface-sunken"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface-sunken p-3">
          <div className="text-[12.5px] font-bold text-text">Still stuck?</div>
          <p className="mt-0.5 text-[12px] text-muted">Contact {HR_CONTACT} in HR — she can help directly.</p>
          <button className="mt-2 rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-accent-hover">Contact HR</button>
        </div>

        <button
          onClick={() => {
            closeHelp();
            setTourOpen(true);
            router.push("/onboarding/home");
          }}
          className="mt-3 w-full text-center text-[12px] font-semibold text-accent-ink hover:underline"
        >
          Replay the 1-minute tour
        </button>
      </div>

      {helpContext?.stepId && (
        <div className="shrink-0 border-t border-border p-3">
          <button onClick={closeHelp} className="w-full rounded-lg border border-border py-2 text-[12.5px] font-semibold text-text hover:bg-surface-sunken">
            Back to form
          </button>
        </div>
      )}
    </div>
  );
}
