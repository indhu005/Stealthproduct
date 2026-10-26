"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const flows = [
  { label: "Dashboard", href: "/", match: (p: string) => p === "/" },
  { label: "Payroll", href: "/payroll", match: (p: string) => p.startsWith("/payroll") },
  { label: "Time off", href: "/time-off", match: (p: string) => p.startsWith("/time-off") },
  { label: "Onboarding", href: "/onboarding/welcome", match: (p: string) => p.startsWith("/onboarding") },
  { label: "Integration", href: "/integration", match: (p: string) => p.startsWith("/integration") },
];

export function FlowSwitcher() {
  const pathname = usePathname();
  // The page is fully static-prerendered, so the server has no real request
  // path to match against — computing `active` from usePathname() during
  // that prerender disagrees with the client's actual pathname and triggers
  // a hydration mismatch. Rendering "nothing active" until mount keeps the
  // server and client's first paint identical; the real state applies a
  // tick later, after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex items-center justify-center gap-2 pb-1 pt-4">
      <nav aria-label="Switch flow" className="flex items-center gap-1 rounded-full border border-border bg-surface p-1 shadow-card">
        {flows.map((f) => {
          const active = mounted && f.match(pathname);
          return (
            <Link
              key={f.href}
              href={f.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                active ? "bg-accent text-white" : "text-muted hover:bg-surface-sunken hover:text-text"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>
      <a
        href="https://claude.ai/artifact/XPBC2Md1rZJuy7fKT414mY#slide-3dd33bdac6c2"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-border bg-surface px-3.5 py-2 text-[12.5px] font-semibold text-muted shadow-card transition-colors hover:bg-surface-sunken hover:text-text"
      >
        To presentation →
      </a>
    </div>
  );
}
