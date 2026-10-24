import Link from "next/link";
import type { StepId, StepStatus } from "@/lib/onboarding/types";

export function ProgressBar({ done, total, minutesLeft }: { done: number; total: number; minutesLeft?: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div>
      {/* Progress is stated in text too — never rely on the bar alone (spec section 9). */}
      <div className="mb-1.5 flex items-center justify-between text-[12px] text-muted">
        <span>
          {done} of {total} done
        </span>
        {minutesLeft !== undefined && <span>{minutesLeft === 0 ? "Done" : `${minutesLeft} min left`}</span>}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const statusMeta: Record<StepStatus, { label: string; icon: string; classes: string }> = {
  not_started: { label: "Not started", icon: "○", classes: "bg-surface-sunken text-faint" },
  in_progress: { label: "In progress", icon: "◐", classes: "bg-accent-soft text-accent-ink" },
  needs_attention: { label: "Needs attention", icon: "!", classes: "bg-warning-soft text-warning" },
  done: { label: "Done", icon: "✓", classes: "bg-success-soft text-success" },
};

export function StepStatusChip({ status, className = "" }: { status: StepStatus; className?: string }) {
  const m = statusMeta[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${m.classes} ${className}`}>
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

export function StepRow({
  stepId,
  index,
  title,
  minutes,
  status,
}: {
  stepId: StepId;
  index: number;
  title: string;
  minutes: number;
  status: StepStatus;
}) {
  return (
    <Link
      href={`/onboarding/step/${stepId}`}
      className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-surface p-3 last:mb-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2"
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[12.5px] font-bold text-accent-ink"
        aria-hidden="true"
      >
        {index}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold text-text">{title}</div>
        <div className="mt-0.5 text-[12px] text-faint">{minutes} min</div>
      </div>
      <StepStatusChip status={status} />
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-faint" aria-hidden="true">
        <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export function AiCard({ prompt, caption, ctaLabel, onClick }: { prompt: string; caption: string; ctaLabel: string; onClick: () => void }) {
  return (
    <div className="mb-4 rounded-xl border border-accent-soft-border bg-accent-soft/40 p-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-ink">
        <SparkleIcon />
        Bolto AI
      </div>
      <p className="text-[12.5px] leading-relaxed text-text">{prompt}</p>
      <button
        onClick={onClick}
        className="mt-2.5 w-full rounded-lg bg-accent px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-accent-hover"
      >
        {ctaLabel}
      </button>
      <p className="mt-1.5 text-[11px] text-faint">{caption}</p>
    </div>
  );
}

export function DemoAutofillButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-4 rounded-md border border-dashed border-accent-soft-border px-2 py-1 text-[11px] font-semibold text-accent-ink"
    >
      Demo: autofill
    </button>
  );
}

export function SparkleIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M8 2L9.2 6.8L14 8L9.2 9.2L8 14L6.8 9.2L2 8L6.8 6.8L8 2Z" fill="currentColor" />
    </svg>
  );
}

export function SuggestionCard({
  text,
  positive = false,
  onUseThis,
  onEdit,
  onDismiss,
}: {
  text: string;
  positive?: boolean;
  onUseThis?: () => void;
  onEdit?: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="flex items-start gap-2">
        <span aria-hidden="true" className={`mt-0.5 text-[13px] font-bold ${positive ? "text-success" : "text-warning"}`}>
          {positive ? "✓" : "!"}
        </span>
        <p className="flex-1 text-[12.5px] leading-relaxed text-text">{text}</p>
      </div>
      <div className="mt-2 flex items-center gap-2">
        {onUseThis && (
          <button onClick={onUseThis} className="rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-accent-hover">
            Use this
          </button>
        )}
        {onEdit && (
          <button onClick={onEdit} className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-text hover:bg-surface-sunken">
            Edit
          </button>
        )}
        <button onClick={onDismiss} className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-text hover:bg-surface-sunken">
          Dismiss
        </button>
      </div>
    </div>
  );
}
