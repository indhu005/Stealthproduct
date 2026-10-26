import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { LaptopFrame } from "@/components/layout/LaptopFrame";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill, SeverityDot } from "@/components/ui/Badge";

const stats = [
  { n: "170", l: "Active workforce" },
  { n: "4", l: "Onboarding", href: "/onboarding/welcome" },
  { n: "14", l: "Pending invoices" },
  { n: "$315.5k", l: "Spend this month" },
];

export default function Home() {
  return (
    <LaptopFrame>
    <AppShell active="overview">
      <Topbar title="Welcome back, Omaid" />

      <Card className="mb-4.5 p-4">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-faint">Start here</div>
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/payroll"
            className="rounded-lg border border-border p-3 transition-colors hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent-ink">
              1
            </div>
            <div className="text-[13px] font-semibold">Payroll blocker</div>
            <div className="mt-0.5 text-[12px] text-muted">Resolve a blocked payroll run</div>
          </Link>
          <Link
            href="/integration"
            className="rounded-lg border border-border p-3 transition-colors hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent-ink">
              2
            </div>
            <div className="text-[13px] font-semibold">Integration</div>
            <div className="mt-0.5 text-[12px] text-muted">Connect and monitor an HRIS sync</div>
          </Link>
          <Link
            href="/onboarding/welcome"
            className="rounded-lg border border-border p-3 transition-colors hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent-ink">
              3
            </div>
            <div className="text-[13px] font-semibold">Onboarding</div>
            <div className="mt-0.5 text-[12px] text-muted">Walk through a new hire&rsquo;s own view</div>
          </Link>
        </div>
      </Card>

      <Card className="mb-2 flex items-end justify-between gap-6 bg-accent-soft p-6">
        <div>
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-accent-ink">
            Next payroll
          </div>
          <div className="tabular-nums mb-2 text-[38px] font-bold leading-none tracking-tight">
            $21,300
          </div>
          <div className="text-[13px] text-muted">
            87 employees · due <span className="font-semibold text-text">Mar 24</span>
            <Pill tone="warning">in 6 days</Pill>
          </div>
        </div>
        <Link
          href="/payroll"
          className="appearance-none rounded-lg bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Review payroll →
        </Link>
      </Card>

      <div className="my-4.5 mx-0.5 flex">
        {stats.map((s, i) =>
          s.href ? (
            <Link
              key={s.l}
              href={s.href}
              className={`flex-1 rounded-md px-5 py-1 transition-colors hover:bg-surface-sunken ${i !== stats.length - 1 ? "border-r border-border" : ""} ${i === 0 ? "pl-1" : ""}`}
            >
              <div className="tabular-nums text-[19px] font-bold tracking-tight text-accent-ink">{s.n}</div>
              <div className="mt-0.5 text-[12px] text-faint">{s.l}</div>
            </Link>
          ) : (
            <div
              key={s.l}
              className={`flex-1 px-5 ${i !== stats.length - 1 ? "border-r border-border" : ""} ${i === 0 ? "pl-1" : ""}`}
            >
              <div className="tabular-nums text-[19px] font-bold tracking-tight">{s.n}</div>
              <div className="mt-0.5 text-[12px] text-faint">{s.l}</div>
            </div>
          )
        )}
      </div>

      <div className="mb-2.5 flex items-center gap-2">
        <h3 className="text-[14px] font-bold">Needs your attention</h3>
        <span className="rounded-full bg-surface-sunken px-1.75 py-0.5 text-[11px] font-bold text-muted">4</span>
      </div>

      <Card className="mb-7 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <SeverityDot severity="critical" />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold">EWN file missing — Jane Doe</div>
            <div className="mt-0.5 text-[12.5px] text-muted">This blocks her payment in the Mar 24 run</div>
          </div>
          <Button size="small" disabled>
            Resolve
          </Button>
        </div>
        <div className="flex items-center gap-3 border-b border-border p-4">
          <SeverityDot severity="warning" />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold">W-4 forms missing</div>
            <div className="mt-0.5 text-[12.5px] text-muted">3 new hires haven&rsquo;t submitted tax forms</div>
          </div>
          <Button size="small" variant="warning" disabled>
            Remind
          </Button>
        </div>
        <div className="flex items-center gap-3 border-b border-border p-4">
          <SeverityDot severity="neutral" />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold">Time off request — Jane Doe</div>
            <div className="mt-0.5 text-[12.5px] text-muted">3 days, Jul 2 – Jul 4</div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/time-off"
              className="appearance-none rounded-xl bg-transparent px-3.5 py-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:text-critical"
            >
              Decline
            </Link>
            <Link
              href="/time-off"
              className="appearance-none rounded-xl bg-accent px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(47,98,245,0.45)] transition-colors hover:bg-accent-hover"
            >
              Approve
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <SeverityDot severity="neutral" />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold">Jordan Rivera hasn&rsquo;t finished onboarding</div>
            <div className="mt-0.5 text-[12.5px] text-muted">Invite emailed Oct 20 &middot; starts Mon, Nov 2</div>
          </div>
          <Link
            href="/onboarding/welcome"
            className="appearance-none rounded-xl bg-accent px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(47,98,245,0.45)] transition-colors hover:bg-accent-hover"
          >
            View invite →
          </Link>
        </div>
      </Card>

      <Card className="border-dashed p-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-faint">Base layer</div>
        <p className="mt-2 max-w-[60ch] text-[13.5px] leading-relaxed text-muted">
          This is the shared shell and component set — <span className="font-semibold text-text">Button</span>,{" "}
          <span className="font-semibold text-text">Card</span>, <span className="font-semibold text-text">Badge</span>,{" "}
          <span className="font-semibold text-text">Sidebar</span>/<span className="font-semibold text-text">Topbar</span>.
          The <span className="font-semibold text-text">Payroll</span>, <span className="font-semibold text-text">Time off</span>,{" "}
          <span className="font-semibold text-text">Onboarding</span>, and{" "}
          <span className="font-semibold text-text">Integrations</span> flows above are live. Onboarding is the one
          employee-facing, phone-shaped flow — the &ldquo;Onboarding&rdquo; stat and the Jordan Rivera row both open it,
          starting from the invite email a new hire actually gets. Integrations is an admin/IT tool — find it under{" "}
          <span className="font-semibold text-text">Organization</span> in the sidebar, or in the flow switcher above.
          The remaining buttons in this Overview are still disabled: they&rsquo;re part of the static shell, not wired
          to a flow yet.
        </p>
      </Card>
    </AppShell>
    </LaptopFrame>
  );
}
