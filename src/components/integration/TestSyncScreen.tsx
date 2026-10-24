import type { IntegrationState } from "@/lib/integration/types";
import { blockingCount, needsAttentionCount, readyCount, unresolvedIssues } from "@/lib/integration/derive";
import { Button } from "@/components/ui/Button";
import { StatCard, BlocksPayrollTag, Banner } from "./ui";

export function TestSyncScreen({
  state,
  onReview,
  onGoLive,
}: {
  state: IntegrationState;
  onReview: (recordId: string) => void;
  onGoLive: () => void;
}) {
  const ready = readyCount(state);
  const needsAttention = needsAttentionCount(state);
  const blocking = blockingCount(state);
  const issues = unresolvedIssues(state);

  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-faint">Sandbox &middot; no live data touched</div>
      <h1 className="mb-5 text-[22px] font-bold tracking-tight text-text">
        Test complete: {ready.toLocaleString()} of {state.test.checked.toLocaleString()} records are ready.{" "}
        {needsAttention > 0 ? `${needsAttention} need attention.` : "Nothing needs attention."}
      </h1>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard label="Checked" value={state.test.checked.toLocaleString()} />
        <div className="rounded-xl border border-success/30 bg-success-soft p-4">
          <div className="text-[11.5px] text-success">✓ Ready</div>
          <div className="tabular-nums mt-1 text-[22px] font-bold tracking-tight text-success">{ready.toLocaleString()}</div>
        </div>
        {needsAttention > 0 ? (
          <div className="rounded-xl border border-warning/30 bg-warning-soft p-4">
            <div className="text-[11.5px] text-warning">! Needs attention</div>
            <div className="tabular-nums mt-1 text-[22px] font-bold tracking-tight text-warning">{needsAttention}</div>
            {blocking > 0 && <div className="mt-0.5 text-[11.5px] text-warning">blocking {blocking}</div>}
          </div>
        ) : (
          <div className="rounded-xl border border-success/30 bg-success-soft p-4">
            <div className="text-[11.5px] text-success">✓ Needs attention</div>
            <div className="tabular-nums mt-1 text-[22px] font-bold tracking-tight text-success">0</div>
          </div>
        )}
      </div>

      {issues.length === 0 ? (
        <Banner tone="success" className="mb-6">
          All records synced. Nothing needs attention.
        </Banner>
      ) : (
        <div className="mb-6 overflow-hidden rounded-xl border border-border">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-[11px] uppercase tracking-wider text-faint">
                <th className="px-4 py-2.5 font-semibold">Person</th>
                <th className="px-4 py-2.5 font-semibold">Record</th>
                <th className="px-4 py-2.5 font-semibold">Reason</th>
                <th className="px-4 py-2.5 font-semibold">Blocks payroll</th>
                <th className="px-4 py-2.5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, i) => (
                <tr key={issue.recordId} className={i !== issues.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-4 py-3 text-[13px] font-semibold text-text">{issue.person}</td>
                  <td className="px-4 py-3 text-[12.5px] text-muted">{issue.recordId}</td>
                  <td className="px-4 py-3 text-[12.5px] text-muted">{issue.reason}</td>
                  <td className="px-4 py-3">
                    <BlocksPayrollTag blocks={issue.blocksPayroll} />
                  </td>
                  <td className="px-4 py-3">
                    <Button size="small" variant="secondary" onClick={() => onReview(issue.recordId)}>
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={onGoLive}
          disabled={blocking > 0}
          title={blocking > 0 ? `${blocking} blocking item${blocking === 1 ? "" : "s"} left` : undefined}
        >
          Continue to go-live
        </Button>
        <Button variant="secondary" disabled>
          Re-run test
        </Button>
        <Button variant="secondary" disabled>
          Export the list
        </Button>
      </div>
      {blocking > 0 && <p className="mt-2 text-[12px] text-faint">{blocking} blocking item{blocking === 1 ? "" : "s"} left.</p>}
    </div>
  );
}
