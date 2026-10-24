import type { ConnectionStage } from "@/lib/integration/types";

const stageMeta: Record<ConnectionStage, { label: string; icon: string; classes: string }> = {
  disconnected: { label: "Disconnected", icon: "○", classes: "bg-surface-sunken text-faint" },
  sandbox: { label: "Sandbox", icon: "◐", classes: "bg-accent-soft text-accent-ink" },
  tested: { label: "Tested", icon: "✓", classes: "bg-accent-soft text-accent-ink" },
  pilot: { label: "Pilot", icon: "◐", classes: "bg-accent-soft text-accent-ink" },
  live: { label: "Live", icon: "✓", classes: "bg-success-soft text-success" },
  paused: { label: "Paused", icon: "⏸", classes: "bg-warning-soft text-warning" },
  error: { label: "Error", icon: "✕", classes: "bg-critical-soft text-critical" },
};

export function ConnectionStatusChip({ stage, className = "" }: { stage: ConnectionStage; className?: string }) {
  const m = stageMeta[stage];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${m.classes} ${className}`}>
      <span aria-hidden="true">{m.icon}</span>
      {m.label}
    </span>
  );
}

const bannerTones = {
  info: "border-accent-soft-border bg-accent-soft text-accent-ink",
  warning: "border-warning/30 bg-warning-soft text-warning",
  critical: "border-critical/30 bg-critical-soft text-critical",
  success: "border-success/30 bg-success-soft text-success",
  neutral: "border-border bg-surface-sunken text-muted",
} as const;

export function Banner({
  tone = "info",
  children,
  className = "",
}: {
  tone?: keyof typeof bannerTones;
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rounded-xl border p-3 text-[12.5px] leading-relaxed ${bannerTones[tone]} ${className}`}>{children}</div>;
}

export function StatCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-[11.5px] text-faint">{label}</div>
      <div className="tabular-nums mt-1 text-[22px] font-bold tracking-tight text-text">{value}</div>
      {detail && <div className="mt-0.5 text-[11.5px] text-faint">{detail}</div>}
    </div>
  );
}

export function BlocksPayrollTag({ blocks }: { blocks: boolean }) {
  return blocks ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-critical-soft px-2 py-0.5 text-[11px] font-semibold text-critical">
      <span aria-hidden="true">⛔</span>
      Blocks payroll
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold text-faint">
      <span aria-hidden="true">○</span>
      Does not block
    </span>
  );
}
