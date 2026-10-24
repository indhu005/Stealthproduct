"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const flows = [
  { label: "Dashboard", href: "/", match: (p: string) => p === "/" },
  { label: "Payroll", href: "/payroll", match: (p: string) => p.startsWith("/payroll") },
  { label: "Time off", href: "/time-off", match: (p: string) => p.startsWith("/time-off") },
  { label: "Onboarding", href: "/onboarding/welcome", match: (p: string) => p.startsWith("/onboarding") },
];

export function FlowSwitcher() {
  const pathname = usePathname();

  return (
    <div className="flex justify-center pb-1 pt-4">
      <nav aria-label="Switch flow" className="flex items-center gap-1 rounded-full border border-border bg-surface p-1 shadow-card">
        {flows.map((f) => {
          const active = f.match(pathname);
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
    </div>
  );
}
