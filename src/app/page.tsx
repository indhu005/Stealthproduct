import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { LaptopFrame } from "@/components/layout/LaptopFrame";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill, SeverityDot } from "@/components/ui/Badge";

const stats = [
  { n: "170", l: "Active workforce" },
  { n: "4", l: "Onboarding" },
  { n: "14", l: "Pending invoices" },
  { n: "$315.5k", l: "Spend this month" },
];

export default function Home() {
  return (
    <LaptopFrame>
    <AppShell active="overview">
      <Topbar title="Welcome back, Omaid" />

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
        {stats.map((s, i) => (
          <div
            key={s.l}
            className={`flex-1 px-5 ${i !== stats.length - 1 ? "border-r border-border" : ""} ${i === 0 ? "pl-1" : ""}`}
          >
            <div className="tabular-nums text-[19px] font-bold tracking-tight">{s.n}</div>
            <div className="mt-0.5 text-[12px] text-faint">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mb-2.5 flex items-center gap-2">
        <h3 className="text-[14px] font-bold">Needs your attention</h3>
        <span className="rounded-full bg-surface-sunken px-1.75 py-0.5 text-[11px] font-bold text-muted">3</span>
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
        <div className="flex items-center gap-3 p-4">
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
      </Card>

      <Card className="border-dashed p-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-faint">Base layer</div>
        <p className="mt-2 max-w-[60ch] text-[13.5px] leading-relaxed text-muted">
          This is the shared shell and component set — <span className="font-semibold text-text">Button</span>,{" "}
          <span className="font-semibold text-text">Card</span>, <span className="font-semibold text-text">Badge</span>,{" "}
          <span className="font-semibold text-text">Sidebar</span>/<span className="font-semibold text-text">Topbar</span>.
          The <span className="font-semibold text-text">Payroll</span> and{" "}
          <span className="font-semibold text-text">Time off</span> flows above are live — click &ldquo;Review
          payroll,&rdquo; the time off request, or the sidebar. The remaining buttons in this Overview are still
          disabled: they&rsquo;re part of the static shell, not wired to a flow yet.
        </p>
      </Card>

      <Card className="mt-4 flex items-center justify-between gap-4 p-5">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-faint">New hire preview</div>
          <p className="mt-1.5 max-w-[52ch] text-[13.5px] leading-relaxed text-muted">
            A separate, phone-shaped concept: the new-hire <span className="font-semibold text-text">Onboarding</span> flow —
            checklist, step forms, scripted AI help, and a short product tour.
          </p>
        </div>
        <Link
          href="/onboarding/welcome"
          className="shrink-0 appearance-none rounded-xl border border-border bg-surface px-4 py-2.5 text-[13px] font-semibold text-text transition-colors hover:bg-surface-sunken"
        >
          Preview onboarding →
        </Link>
      </Card>
    </AppShell>
    </LaptopFrame>
  );
}
