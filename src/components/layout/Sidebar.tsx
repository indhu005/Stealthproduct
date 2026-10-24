"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NumberBadge } from "@/components/ui/Badge";

function GroupLabel({ children, badge }: { children: React.ReactNode; badge?: number }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 pt-3.5 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-faint first:pt-0">
      {children}
      {badge !== undefined && <NumberBadge n={badge} />}
    </div>
  );
}

function NavItem({
  href,
  icon,
  active = false,
  disabled = false,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const classes = `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
    active
      ? "bg-accent-soft-border font-semibold text-accent-ink [&_svg]:opacity-100"
      : "text-text [&_svg]:opacity-70"
  } ${disabled ? "cursor-default opacity-40" : "hover:bg-surface"}`;

  if (disabled) {
    return (
      <div className={classes}>
        {icon}
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={classes}>
      {icon}
      {children}
    </Link>
  );
}

const icons = {
  grid: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" />
    </svg>
  ),
  tasks: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2.5" y="3" width="11" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 6.5H13.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  people: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 13.5C2.5 10.5 5 9 8 9C11 9 13.5 10.5 13.5 13.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  timeoff: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 6.5H13.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  payroll: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path
        d="M8 2V14M11.5 4.5C11.5 3.4 10 2.5 8 2.5C6 2.5 4.5 3.4 4.5 4.6C4.5 7 11.5 6 11.5 8.9C11.5 10.3 10 11.3 8 11.3C6 11.3 4.5 10.3 4.5 9.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  documents: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="3" y="2" width="10" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 5.5H10.5M5.5 8H10.5M5.5 10.5H8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 2.5V4M8 12V13.5M13.5 8H12M4 8H2.5M11.8 4.2L10.7 5.3M5.3 10.7L4.2 11.8M11.8 11.8L10.7 10.7M5.3 5.3L4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  ),
};

type SearchItem = { label: string; meta: string; href: string };

const searchablePages: SearchItem[] = [
  { label: "Payroll overview", meta: "Page", href: "/payroll" },
  { label: "Draft payroll", meta: "Page", href: "/payroll" },
  { label: "Review payroll", meta: "Page", href: "/payroll" },
];

const searchableEmployees: SearchItem[] = [
  { label: "Dev Patel", meta: "Employee", href: "/payroll" },
  { label: "Maya Chen", meta: "Employee", href: "/payroll" },
  { label: "Luis Ortega", meta: "Employee", href: "/payroll" },
  { label: "Priya Nair", meta: "Employee", href: "/payroll" },
  { label: "Tom Becker", meta: "Employee", href: "/payroll" },
];

const suggestedQuestions = ["Why is payroll blocked?", "When is next payroll?"];

function answerFor(question: string): { text: string; actionLabel: string } {
  const q = question.toLowerCase();
  if (q.includes("block") || q.includes("dev")) {
    return {
      text: "Dev Patel moved from WA to CA on Oct 15, so payroll needs his California tax form (DE 4). It blocks Friday's payroll until it arrives. Bolto is handling company registration (est. Nov 3).",
      actionLabel: "Open resolver",
    };
  }
  if (q.includes("when") || q.includes("next payroll") || q.includes("due")) {
    return {
      text: "The next payroll run is Friday, Oct 30, covering the Oct 12–25 pay period.",
      actionLabel: "View payroll",
    };
  }
  return {
    text: "I don't have an answer for that yet in this concept — try asking what's blocking payroll or when it's due.",
    actionLabel: "Go to payroll",
  };
}

function SearchAI() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"browse" | "thinking" | "answer">("browse");
  const [askedQuestion, setAskedQuestion] = useState("");

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setView("browse");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const askAI = (question: string) => {
    setAskedQuestion(question);
    setView("thinking");
    window.setTimeout(() => setView("answer"), 700);
  };

  const results = query
    ? [...searchableEmployees, ...searchablePages].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div ref={rootRef} className="relative mb-3.5">
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-[12.5px] text-faint">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onFocus={() => {
            setOpen(true);
            setView("browse");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setView("browse");
          }}
          placeholder="Search or ask AI"
          className="flex-1 bg-transparent text-text placeholder:text-faint focus:outline-none"
        />
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-accent">
          <path d="M8 2L9.2 6.8L14 8L9.2 9.2L8 14L6.8 9.2L2 8L6.8 6.8L8 2Z" fill="currentColor" />
        </svg>
        <span className="shrink-0 rounded border border-border bg-surface-sunken px-1 font-mono text-[10px] text-faint">
          ⌘K
        </span>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 overflow-hidden rounded-lg border border-border bg-surface shadow-card">
          {view === "browse" && (
            <div className="max-h-[320px] overflow-y-auto p-1.5">
              {query === "" ? (
                <>
                  <div className="px-2 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">Suggested</div>
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => askAI(q)}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12.5px] hover:bg-surface-sunken"
                    >
                      <span>{q}</span>
                      <span className="text-[10.5px] text-faint">Ask AI</span>
                    </button>
                  ))}
                  {searchablePages.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setOpen(false);
                        router.push(p.href);
                      }}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12.5px] hover:bg-surface-sunken"
                    >
                      <span>{p.label}</span>
                      <span className="text-[10.5px] text-faint">{p.meta}</span>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <button
                    onClick={() => askAI(query)}
                    className="flex w-full items-center justify-between rounded-md bg-accent-soft px-2 py-1.5 text-left text-[12.5px] font-semibold text-accent-ink"
                  >
                    <span>
                      Ask AI <span className="font-normal">&ldquo;{query}&rdquo;</span>
                    </span>
                  </button>
                  {results.length > 0 && (
                    <>
                      <div className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-faint">Results</div>
                      {results.map((r) => (
                        <button
                          key={r.label}
                          onClick={() => {
                            setOpen(false);
                            router.push(r.href);
                          }}
                          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12.5px] hover:bg-surface-sunken"
                        >
                          <span>{r.label}</span>
                          <span className="text-[10.5px] text-faint">{r.meta}</span>
                        </button>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {view === "thinking" && (
            <div className="p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[12.5px] font-bold">Bolto AI</span>
                <button
                  onClick={() => setView("browse")}
                  className="text-[11px] text-faint hover:text-text"
                >
                  Back to search
                </button>
              </div>
              <div className="flex items-center gap-2 py-2 text-[12.5px] text-muted">
                <svg className="h-3.5 w-3.5 animate-spin text-accent" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                  <path d="M14 8A6 6 0 0 0 8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Thinking&hellip;
              </div>
            </div>
          )}

          {view === "answer" && (
            <div className="p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[12.5px] font-bold">Bolto AI</span>
                <button
                  onClick={() => setView("browse")}
                  className="text-[11px] text-faint hover:text-text"
                >
                  Back to search
                </button>
              </div>
              <span className="inline-block rounded-md bg-accent-soft px-2 py-1 text-[12px] font-semibold text-accent-ink">
                {askedQuestion}
              </span>
              <p className="mt-2 text-[12.5px] leading-relaxed text-text">{answerFor(askedQuestion).text}</p>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/payroll");
                }}
                className="mt-3 rounded-lg bg-accent px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-accent-hover"
              >
                {answerFor(askedQuestion).actionLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ active }: { active?: string }) {
  return (
    <div className="flex w-[232px] shrink-0 flex-col gap-1 border-r border-border bg-surface-sunken p-3.5">
      <div className="flex items-center gap-1.5 px-2 pb-4 pt-1 text-base font-bold tracking-tight">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M9 1L2.5 9.5H7.5L6.5 15L13.5 6H8.5L9 1Z" fill="var(--color-accent)" />
        </svg>
        bolto
      </div>

      <SearchAI />

      <GroupLabel>Workspace</GroupLabel>
      <NavItem href="/" icon={icons.grid} active={active === "overview"}>
        Overview
      </NavItem>
      <NavItem href="/" icon={icons.tasks} disabled>
        Tasks
      </NavItem>
      <NavItem href="/" icon={icons.calendar} disabled>
        Calendar
      </NavItem>

      <GroupLabel badge={3}>People</GroupLabel>
      <NavItem href="/" icon={icons.people} disabled>
        Directory
      </NavItem>
      <NavItem href="/" icon={icons.timeoff} disabled>
        Time off
      </NavItem>
      <NavItem href="/payroll" icon={icons.payroll} active={active === "payroll"}>
        Payroll
      </NavItem>

      <GroupLabel>Organization</GroupLabel>
      <NavItem href="/" icon={icons.documents} disabled>
        Documents
      </NavItem>
      <NavItem href="/" icon={icons.settings} disabled>
        Settings
      </NavItem>

      <div className="mt-3.5 flex items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5">
        <div className="h-6.5 w-6.5 shrink-0 rounded-full bg-accent" />
        <div>
          <div className="text-[12.5px] font-semibold">Omaid Wakily</div>
          <div className="text-[11px] text-faint">Admin</div>
        </div>
      </div>
    </div>
  );
}
