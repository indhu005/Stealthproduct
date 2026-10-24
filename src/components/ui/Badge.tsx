export function NumberBadge({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[9.5px] font-bold text-white ${className}`}
    >
      {n}
    </span>
  );
}

type Severity = "critical" | "warning" | "neutral";

const dotClasses: Record<Severity, string> = {
  critical: "bg-critical",
  warning: "bg-warning",
  neutral: "bg-faint",
};

export function SeverityDot({ severity, className = "" }: { severity: Severity; className?: string }) {
  return <span className={`h-2 w-2 shrink-0 rounded-full ${dotClasses[severity]} ${className}`} />;
}

export function Pill({
  tone = "warning",
  children,
  className = "",
}: {
  tone?: "warning" | "success" | "critical" | "accent" | "neutral";
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
    critical: "bg-critical-soft text-critical",
    accent: "bg-accent-soft text-accent-ink",
    neutral: "bg-surface-sunken text-faint",
  } as const;
  return (
    <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export type PayrollStage = "blocked" | "requested" | "resolved" | "approved";

const stageChip: Record<PayrollStage, { bg: string; label: string; icon: string }> = {
  blocked: { bg: "bg-critical", label: "Blocked: CA tax form", icon: "⛔" },
  requested: { bg: "bg-warning", label: "Waiting on Dev", icon: "●" },
  resolved: { bg: "bg-success", label: "CA form ready", icon: "✓" },
  approved: { bg: "bg-accent", label: "Approved", icon: "✓" },
};

// Status chips in the source design are solid-filled with white text (not the
// soft/tinted style used for other pills) — never rely on color alone, so
// every chip still pairs an icon with its label.
export function StatusChip({ stage, className = "" }: { stage: PayrollStage; className?: string }) {
  const { bg, label, icon } = stageChip[stage];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white ${bg} ${className}`}>
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}
