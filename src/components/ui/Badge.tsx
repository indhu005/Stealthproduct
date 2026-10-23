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
  tone?: "warning" | "success" | "critical";
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
    critical: "bg-critical-soft text-critical",
  } as const;
  return (
    <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
