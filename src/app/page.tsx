import { AppShell } from "@/components/layout/AppShell";
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
    <AppShell active="overview">
      <Topbar title="Welcome back, Omaid" />

      <Card className="mb-2 flex items-end justify-between gap-6 bg-gradient-to-b from-accent-soft to-surface p-6">
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
        <Button disabled>Review payroll →</Button>
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
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="small" disabled>
              Decline
            </Button>
            <Button size="small" disabled>
              Approve
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-dashed p-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-faint">Base layer</div>
        <p className="mt-2 max-w-[60ch] text-[13.5px] leading-relaxed text-muted">
          This is the shared shell and component set — <span className="font-semibold text-text">Button</span>,{" "}
          <span className="font-semibold text-text">Card</span>, <span className="font-semibold text-text">Badge</span>,{" "}
          <span className="font-semibold text-text">Sidebar</span>/<span className="font-semibold text-text">Topbar</span> —
          that the two interactive flows will be built on once they&rsquo;re picked. Buttons above are disabled on
          purpose: they&rsquo;re part of the static shell, not a flow yet.
        </p>
      </Card>
    </AppShell>
  );
}
