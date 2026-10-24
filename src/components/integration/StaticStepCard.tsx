import { Button } from "@/components/ui/Button";

// Screens 1–3 and 5 are shown as a static completed-step summary rather
// than full interactive builds, per the spec's build order — the demo
// centers on Test sync, Monitor, and Resolve (screens 4, 6, 7). Still
// offers a "Continue" action so clicking through from Connect reads as
// one flow rather than four dead-end tabs.
export function StaticStepCard({
  title,
  summary,
  nextLabel,
  onContinue,
}: {
  title: string;
  summary: string;
  nextLabel: string;
  onContinue: () => void;
}) {
  return (
    <div className="mx-auto max-w-[520px]">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success-soft text-[13px] font-bold text-success">
          ✓
        </span>
        <h1 className="text-[19px] font-bold tracking-tight text-text">{title}</h1>
        <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success">Completed</span>
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-surface-sunken p-5">
        <p className="text-[13px] leading-relaxed text-muted">{summary}</p>
      </div>
      <Button className="mt-4" onClick={onContinue}>
        {nextLabel}
      </Button>
      <p className="mt-3 text-[11.5px] text-faint">
        Concept note: this step isn&rsquo;t built out interactively — the demo focuses on Test sync, Monitor, and resolving a sync
        error.
      </p>
    </div>
  );
}
