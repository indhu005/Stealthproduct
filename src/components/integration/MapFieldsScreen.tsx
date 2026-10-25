"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MATCHED_FIELD_COUNT, MATCHED_FIELD_SAMPLE } from "@/lib/integration/data";
import type { FieldMapping } from "@/lib/integration/types";

export function MapFieldsScreen({
  mappings,
  onResolve,
  onContinue,
}: {
  mappings: FieldMapping[];
  onResolve: (source: string) => void;
  onContinue: () => void;
}) {
  const [showHigh, setShowHigh] = useState(false);
  const needsReview = mappings.filter((m) => m.status === "needs_review");
  const canContinue = needsReview.length === 0;

  return (
    <div className="max-w-[760px]">
      <h1 className="text-[22px] font-bold tracking-tight text-text">Match your fields</h1>
      <p className="mt-1 text-[13px] text-muted">Only rows that need you are open.</p>

      <div className="mt-5 grid grid-cols-[1fr_1fr_1.3fr] gap-3 px-1 text-[11px] font-semibold uppercase tracking-wider text-faint">
        <span>Your system</span>
        <span>Our product</span>
        <span>Confidence</span>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {mappings.map((m) => {
          const resolved = m.status === "matched";
          return (
            <div
              key={m.source}
              className={`grid grid-cols-[1fr_1fr_1.3fr] items-center gap-3 rounded-2xl border-[1.5px] p-4 ${
                resolved ? "border-success/30 bg-success-soft" : "border-warning/30 bg-warning-soft"
              }`}
            >
              <span className="font-mono text-[13px] text-text">{m.source}</span>
              <span>
                <span className="text-[14px] font-semibold text-text">{m.target}</span>
                {m.note && <span className="block text-[12px] text-faint">{m.note}</span>}
              </span>
              <span className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-lg px-2.5 py-1 text-[12px] font-semibold ${
                    resolved ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                  }`}
                >
                  {resolved ? "✓ Resolved" : "! Needs review"}
                </span>
                {!resolved && (
                  <Button size="small" variant="secondary" onClick={() => onResolve(m.source)}>
                    Use suggested match
                  </Button>
                )}
              </span>
            </div>
          );
        })}

        <button
          type="button"
          aria-expanded={showHigh}
          onClick={() => setShowHigh((v) => !v)}
          className="min-h-[52px] rounded-2xl border border-dashed border-accent-soft-border bg-accent-soft px-4 text-left text-[13.5px] font-semibold text-accent-ink"
        >
          ✓ {MATCHED_FIELD_COUNT} matched automatically &middot; {showHigh ? "Hide" : "Show"} matches
        </button>
        {showHigh && (
          <div className="grid grid-cols-3 gap-1.5">
            {MATCHED_FIELD_SAMPLE.map((h) => (
              <div key={h.source} className="rounded-lg border border-border p-2 text-[12px]">
                <span className="font-mono">{h.source}</span> → {h.target}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={onContinue} disabled={!canContinue}>
          Run a test sync
        </Button>
        {!canContinue && (
          <span className="text-[12.5px] text-faint">
            {needsReview.length} required field{needsReview.length === 1 ? "" : "s"} left.
          </span>
        )}
      </div>
    </div>
  );
}
