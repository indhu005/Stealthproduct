import type { ConnectionStage, EdgeCaseToggles, IntegrationState } from "@/lib/integration/types";
import { unresolvedIssues } from "@/lib/integration/derive";
import { Button } from "@/components/ui/Button";
import { ConnectionStatusChip, Banner, StatCard } from "./ui";

const deliveryMeta = {
  ok: { label: "OK", classes: "bg-success-soft text-success" },
  retrying: { label: "Retrying", classes: "bg-warning-soft text-warning" },
  failed: { label: "Failed", classes: "bg-critical-soft text-critical" },
} as const;

export function MonitorScreen({
  state,
  edgeCases,
  onResolveClick,
  onMerge,
  onKeepBoth,
  onPauseClick,
  onResume,
  onReconnect,
  onToggleWebhook,
}: {
  state: IntegrationState;
  edgeCases: EdgeCaseToggles;
  onResolveClick: (recordId: string) => void;
  onMerge: () => void;
  onKeepBoth: () => void;
  onPauseClick: () => void;
  onResume: () => void;
  onReconnect: () => void;
  onToggleWebhook: (event: string) => void;
}) {
  const hasError = edgeCases.accessExpired || edgeCases.connectionFails;
  const displayStage: ConnectionStage = hasError ? "error" : state.stage;
  const blocking = unresolvedIssues(state).filter((i) => i.blocksPayroll);
  const topBlocker = blocking[0];
  const queueCount = edgeCases.rateLimited ? 214 : 0;

  return (
    <div>
      {edgeCases.accessExpired && (
        <Banner tone="critical" className="mb-4 flex items-center justify-between gap-3">
          <span>
            <span className="font-semibold">✕ Access expired.</span> Reconnect to resume syncing.
          </span>
          <Button size="small" variant="critical" onClick={onReconnect}>
            Reconnect
          </Button>
        </Banner>
      )}
      {edgeCases.connectionFails && !edgeCases.accessExpired && (
        <Banner tone="critical" className="mb-4">
          <span className="font-semibold">✕ Couldn&rsquo;t reach {state.stage === "paused" ? "the system" : "Example ERP"}.</span> Check
          the connection and try again.
        </Banner>
      )}
      {edgeCases.rateLimited && (
        <Banner tone="warning" className="mb-4">
          ! Syncing is slower than usual. We&rsquo;ll retry automatically.
        </Banner>
      )}

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-text">Sync health</h1>
          <p className="mt-0.5 text-[12.5px] text-muted">
            {displayStage === "paused" ? "Paused" : displayStage === "error" ? "Error" : "Pilot"} &middot; Last sync: {state.lastSyncAt}{" "}
            &middot; Next payroll Fri, Nov 13
          </p>
        </div>
        <ConnectionStatusChip stage={displayStage} />
      </div>

      <div className="text-[11px] font-semibold uppercase tracking-wider text-faint">Needs attention</div>
      <div className="mt-2 flex flex-col gap-2">
        {topBlocker ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4">
            <div>
              <div className="text-[13.5px] font-semibold text-warning">
                ! {blocking.length} record{blocking.length === 1 ? "" : "s"} {blocking.length === 1 ? "is" : "are"} blocking payroll
              </div>
              <div className="mt-0.5 text-[12.5px] text-warning">
                {topBlocker.person}, {topBlocker.recordId}: {topBlocker.reason}
              </div>
            </div>
            <Button size="small" onClick={() => onResolveClick(topBlocker.recordId)}>
              Resolve
            </Button>
          </div>
        ) : (
          <Banner tone="success">All records synced. Nothing needs attention.</Banner>
        )}

        {!state.duplicateResolved && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
            <p className="text-[12.5px] text-text">
              2 records may be the same person: <span className="font-semibold">Marcus Bell</span> (E-0653, E-0654)
            </p>
            <div className="flex shrink-0 gap-2">
              <Button size="small" variant="secondary" onClick={onMerge}>
                Merge
              </Button>
              <Button size="small" variant="secondary" onClick={onKeepBoth}>
                Keep both
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        <StatCard label="Records synced today" value={state.recordsSyncedToday} detail="pilot group" />
        <StatCard label="Failures" value={state.failuresToday} detail="Successes proceeded. Nothing dropped." />
        <StatCard label="Queue" value={queueCount} detail={queueCount > 0 ? "Slower than usual" : "Empty"} />
        <StatCard label="Next scheduled sync" value="in 24 min" detail="Every 30 min" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-[13.5px] font-bold text-text">Webhooks</div>
          <p className="mt-0.5 text-[11.5px] text-muted">Retries are safe to repeat. No double processing.</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {state.webhooks.map((w) => {
              const d = deliveryMeta[w.lastDelivery];
              return (
                <div key={w.event} className="flex items-center justify-between">
                  <code className="text-[12px] text-text">{w.event}</code>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${d.classes}`}>{d.label}</span>
                    <button
                      onClick={() => onToggleWebhook(w.event)}
                      className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                        w.enabled ? "bg-accent-soft text-accent-ink" : "bg-surface-sunken text-faint"
                      }`}
                    >
                      {w.enabled ? "On" : "Off"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <a href="#" onClick={(e) => e.preventDefault()} className="mt-3 inline-block text-[12px] font-semibold text-accent-ink underline">
            View delivery log
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-[13.5px] font-bold text-text">Activity log</div>
            <p className="mt-0.5 text-[11.5px] text-muted">Kept for {state.auditRetentionMonths} months.</p>
            <div className="mt-3 flex flex-col gap-2">
              {state.activity.map((a) => (
                <p key={a.id} className="text-[12px] leading-relaxed text-muted">
                  <span className="font-semibold text-text">{a.when}</span> &middot; {a.text}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-critical/30 p-4">
            <div className="text-[13.5px] font-bold text-critical">Danger zone</div>
            <Button variant="secondary" className="mt-2 w-full border-critical text-critical hover:bg-critical-soft" onClick={state.stage === "paused" ? onResume : onPauseClick}>
              {state.stage === "paused" ? "Resume syncing" : "Pause sync"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
