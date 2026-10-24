"use client";

import { useEffect, useState } from "react";
import type { SyncIssue } from "@/lib/integration/types";
import { SidePanel } from "@/components/ui/SidePanel";
import { Button } from "@/components/ui/Button";
import { NEXT_PAYROLL, SYSTEM_NAME } from "@/lib/integration/data";

type Option = "fix" | "override" | "skip";

export function ResolvePanel({
  issue,
  onClose,
  onRetry,
  onOverride,
  onSkip,
}: {
  issue: SyncIssue | null;
  onClose: () => void;
  onRetry: (recordId: string) => void;
  onOverride: (recordId: string, value: string, reason: string) => void;
  onSkip: (recordId: string) => void;
}) {
  const [option, setOption] = useState<Option | null>(null);
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [skipConfirmed, setSkipConfirmed] = useState(false);

  useEffect(() => {
    setOption(null);
    setValue("");
    setReason("");
    setSkipConfirmed(false);
  }, [issue?.recordId]);

  const resolved = issue && issue.resolution !== undefined;

  return (
    <SidePanel open={!!issue} onClose={onClose} title={issue ? `${issue.person}, ${issue.recordId}` : "Resolve"}>
      {issue && (
        <div className="flex flex-1 flex-col gap-3">
          {resolved ? (
            <>
              <div className="rounded-xl border border-success/30 bg-success-soft p-3 text-[12.5px] text-success">
                <span className="font-semibold">
                  ✓ {issue.resolution === "skipped" ? "Skipped." : issue.resolution === "override_in_product" ? "Override applied." : "Synced."}
                </span>{" "}
                {issue.resolution === "override_in_product" && "The value is flagged as an override and will be replaced when your system updates."}
                {issue.resolution === "skipped" && `${issue.person.split(" ")[0]} won't be paid in this run.`}
                {issue.resolution === "fixed_in_source" && "The record synced successfully."}
              </div>
              <p className="text-[11.5px] text-muted">Log: {resolutionLogText(issue)}</p>
              <Button variant="secondary" onClick={onClose}>
                Back to test results
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-critical/30 bg-critical-soft p-3 text-[12.5px] text-critical">
                <span className="font-semibold">⛔ {issue.reason}.</span> Affects {NEXT_PAYROLL}&rsquo;s payroll. Net pay can&rsquo;t
                be calculated.
              </div>

              <button
                onClick={() => setOption("fix")}
                className={`rounded-xl border p-3 text-left ${option === "fix" ? "border-accent bg-accent-soft" : "border-border"}`}
              >
                <div className="text-[13px] font-semibold text-text">
                  Fix in your system <span className="ml-1 text-[11px] font-semibold text-success">Recommended</span>
                </div>
                <div className="mt-0.5 text-[12px] text-muted">Link out, then retry the sync.</div>
              </button>
              <button
                onClick={() => setOption("override")}
                className={`rounded-xl border p-3 text-left ${option === "override" ? "border-accent bg-accent-soft" : "border-border"}`}
              >
                <div className="text-[13px] font-semibold text-text">Enter it here for now</div>
                <div className="mt-0.5 text-[12px] text-muted">Flagged as an override. Needs a reason.</div>
              </button>
              <button
                onClick={() => setOption("skip")}
                className={`rounded-xl border p-3 text-left ${option === "skip" ? "border-accent bg-accent-soft" : "border-border"}`}
              >
                <div className="text-[13px] font-semibold text-text">Skip this run</div>
                <div className="mt-0.5 text-[12px] text-muted">{issue.person} won&rsquo;t be paid in this run.</div>
              </button>

              {option === "fix" && (
                <div className="flex flex-col gap-2">
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[12.5px] font-semibold text-accent-ink underline">
                    Open {SYSTEM_NAME} to fix the record ↗
                  </a>
                  {issue.retryFailedReason && (
                    <div className="rounded-xl border border-critical/30 bg-critical-soft p-3 text-[12.5px] text-critical">
                      ✕ Retry failed (attempt {issue.retryCount} of 3). Reason: {issue.retryFailedReason}.{" "}
                      <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold underline">
                        Contact support
                      </a>
                    </div>
                  )}
                  <Button onClick={() => onRetry(issue.recordId)}>Retry sync</Button>
                </div>
              )}

              {option === "override" && (
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="mb-1 block text-[12.5px] font-semibold text-text">Corrected value</label>
                    <input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="e.g. TX"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12.5px] font-semibold text-text">Reason (required)</label>
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Confirmed with employee by email"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div className="rounded-xl border border-warning/30 bg-warning-soft p-2.5 text-[12px] text-warning">
                    ! Override. Will be replaced when your system updates.
                  </div>
                  <Button
                    disabled={!value.trim() || !reason.trim()}
                    title={!value.trim() || !reason.trim() ? "Enter a value and a reason to continue." : undefined}
                    onClick={() => onOverride(issue.recordId, value.trim(), reason.trim())}
                  >
                    Apply override
                  </Button>
                  {(!value.trim() || !reason.trim()) && <p className="text-[11.5px] text-faint">Enter a value and a reason to continue.</p>}
                </div>
              )}

              {option === "skip" && (
                <div className="flex flex-col gap-2">
                  <label className="flex items-start gap-2 text-[12.5px] text-text">
                    <input type="checkbox" checked={skipConfirmed} onChange={(e) => setSkipConfirmed(e.target.checked)} className="mt-0.5" />
                    I understand {issue.person} won&rsquo;t be paid in this run.
                  </label>
                  <Button variant="critical" disabled={!skipConfirmed} onClick={() => onSkip(issue.recordId)}>
                    Confirm skip
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </SidePanel>
  );
}

function resolutionLogText(issue: SyncIssue): string {
  if (issue.resolution === "skipped") return `Resolved by Sam Lee, option: Skip this run (${issue.person})`;
  if (issue.resolution === "override_in_product") return `Resolved by Sam Lee, option: Enter it here (${issue.person})`;
  return `Resolved by Sam Lee, option: Fix in system, retry sync (${issue.person})`;
}
