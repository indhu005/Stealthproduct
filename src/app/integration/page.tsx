"use client";

import { useReducer, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LaptopFrame } from "@/components/layout/LaptopFrame";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import type { EdgeCaseToggles, IntegrationState, SyncIssue } from "@/lib/integration/types";
import { COMPANY, INTEGRATION_ADMIN, INTEGRATION_ADMIN_EMAIL, PAYROLL_ADMIN, SYSTEM_NAME, initialIntegrationState } from "@/lib/integration/data";
import { TestSyncScreen } from "@/components/integration/TestSyncScreen";
import { MonitorScreen } from "@/components/integration/MonitorScreen";
import { ResolvePanel } from "@/components/integration/ResolvePanel";
import { StaticStepCard } from "@/components/integration/StaticStepCard";

type Tab = "connect" | "permissions" | "mapfields" | "test" | "golive" | "monitor";

const tabs: { id: Tab; label: string }[] = [
  { id: "connect", label: "Connect" },
  { id: "permissions", label: "Permissions" },
  { id: "mapfields", label: "Map fields" },
  { id: "test", label: "Test sync" },
  { id: "golive", label: "Go live" },
  { id: "monitor", label: "Monitor" },
];

type Action =
  | { type: "retry"; recordId: string; fails: boolean }
  | { type: "override"; recordId: string; value: string; reason: string }
  | { type: "skip"; recordId: string }
  | { type: "merge" }
  | { type: "keepBoth" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "toggleWebhook"; event: string }
  | { type: "reset" };

function reducer(state: IntegrationState, action: Action): IntegrationState {
  switch (action.type) {
    case "retry": {
      const issues = state.test.issues.map((issue) => {
        if (issue.recordId !== action.recordId) return issue;
        if (action.fails) {
          const retryCount = Math.min(issue.retryCount + 1, 3);
          return { ...issue, retryCount, retryFailedReason: "connection timed out" };
        }
        return {
          ...issue,
          retryCount: issue.retryCount + 1,
          retryFailedReason: undefined,
          resolution: "fixed_in_source" as const,
        };
      });
      const resolved = issues.find((i) => i.recordId === action.recordId && i.resolution);
      return {
        ...state,
        test: { ...state.test, issues },
        activity: resolved
          ? [{ id: `log-${Date.now()}`, when: "Just now", text: `Resolved by ${PAYROLL_ADMIN}, option: Fix in system, retry sync (${resolved.person})` }, ...state.activity]
          : state.activity,
      };
    }
    case "override": {
      const issues = state.test.issues.map((issue) =>
        issue.recordId === action.recordId
          ? { ...issue, resolution: "override_in_product" as const, resolutionDetail: `${action.value} — ${action.reason}` }
          : issue
      );
      const target = state.test.issues.find((i) => i.recordId === action.recordId);
      return {
        ...state,
        test: { ...state.test, issues },
        activity: [{ id: `log-${Date.now()}`, when: "Just now", text: `Resolved by ${PAYROLL_ADMIN}, option: Enter it here (${target?.person})` }, ...state.activity],
      };
    }
    case "skip": {
      const issues = state.test.issues.map((issue) =>
        issue.recordId === action.recordId ? { ...issue, resolution: "skipped" as const } : issue
      );
      const target = state.test.issues.find((i) => i.recordId === action.recordId);
      return {
        ...state,
        test: { ...state.test, issues },
        activity: [{ id: `log-${Date.now()}`, when: "Just now", text: `Resolved by ${PAYROLL_ADMIN}, option: Skip this run (${target?.person})` }, ...state.activity],
      };
    }
    case "merge":
      return {
        ...state,
        duplicateResolved: true,
        activity: [{ id: `log-${Date.now()}`, when: "Just now", text: "Merged duplicate records: Marcus Bell (E-0653, E-0654)" }, ...state.activity],
      };
    case "keepBoth":
      return {
        ...state,
        duplicateResolved: true,
        activity: [{ id: `log-${Date.now()}`, when: "Just now", text: "Kept both records: Marcus Bell (E-0653, E-0654)" }, ...state.activity],
      };
    case "pause":
      return { ...state, stage: "paused", activity: [{ id: `log-${Date.now()}`, when: "Just now", text: `Sync paused by ${PAYROLL_ADMIN}` }, ...state.activity] };
    case "resume":
      return { ...state, stage: "pilot", activity: [{ id: `log-${Date.now()}`, when: "Just now", text: `Sync resumed by ${PAYROLL_ADMIN}` }, ...state.activity] };
    case "toggleWebhook":
      return { ...state, webhooks: state.webhooks.map((w) => (w.event === action.event ? { ...w, enabled: !w.enabled } : w)) };
    case "reset":
      return initialIntegrationState;
    default:
      return state;
  }
}

export default function IntegrationPage() {
  const [state, dispatch] = useReducer(reducer, initialIntegrationState);
  const [tab, setTab] = useState<Tab>("connect");
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [edgeCases, setEdgeCases] = useState<EdgeCaseToggles>({
    accessExpired: false,
    retryFails: false,
    rateLimited: false,
    connectionFails: false,
  });

  function toggleEdge(key: keyof EdgeCaseToggles) {
    setEdgeCases((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function resetDemo() {
    dispatch({ type: "reset" });
    setEdgeCases({ accessExpired: false, retryFails: false, rateLimited: false, connectionFails: false });
    setActiveIssueId(null);
    setPauseOpen(false);
    setTab("connect");
  }

  const activeIssue: SyncIssue | null = state.test.issues.find((i) => i.recordId === activeIssueId) ?? null;

  return (
    <LaptopFrame>
      <AppShell active="integration">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[21px] font-bold tracking-tight">Enterprise integration</h2>
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-faint">Concept</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="mr-1 text-[10.5px] font-semibold uppercase tracking-wider text-faint">Edge cases</span>
            {(
              [
                ["accessExpired", "Access expired"],
                ["retryFails", "Retry fails"],
                ["rateLimited", "Rate limited"],
                ["connectionFails", "Connection fails"],
              ] as [keyof EdgeCaseToggles, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleEdge(key)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  edgeCases[key] ? "border-accent bg-accent text-white" : "border-border text-muted hover:bg-surface-sunken"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
            <Button size="small" variant="secondary" onClick={resetDemo}>
              Reset demo
            </Button>
          </div>
        </div>

        <p className="mb-5 text-[12.5px] text-muted">
          {COMPANY} &middot; {SYSTEM_NAME} &middot; {INTEGRATION_ADMIN} ({INTEGRATION_ADMIN_EMAIL})
        </p>

        <div className="mb-6 flex items-center gap-1 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-t-md px-3 py-2 text-[13px] font-semibold transition-colors ${
                tab === t.id ? "border-b-2 border-accent text-accent-ink" : "text-muted hover:text-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "connect" && (
          <StaticStepCard
            title="Connect your ERP"
            summary={`Signed in as ${INTEGRATION_ADMIN_EMAIL} via company login. Connected to ${SYSTEM_NAME} in sandbox — nothing touches live payroll at this stage.`}
            nextLabel="Continue to permissions"
            onContinue={() => setTab("permissions")}
          />
        )}
        {tab === "permissions" && (
          <StaticStepCard
            title="Review permissions"
            summary={`Reads: employee records, pay groups, work locations. Writes: payroll results, pay statements. Access can be revoked anytime; every change is logged and kept for ${state.auditRetentionMonths} months. All 3 entities included (US, Canada, UK).`}
            nextLabel="Approve and continue"
            onContinue={() => setTab("mapfields")}
          />
        )}
        {tab === "mapfields" && (
          <StaticStepCard
            title="Map fields"
            summary="38 fields matched automatically with high confidence. 2 fields needed review and were resolved before the test sync ran."
            nextLabel="Run a test sync"
            onContinue={() => setTab("test")}
          />
        )}
        {tab === "test" && (
          <TestSyncScreen state={state} onReview={(id) => setActiveIssueId(id)} onGoLive={() => setTab("golive")} />
        )}
        {tab === "golive" && (
          <StaticStepCard
            title="Go live"
            summary={`Mapping complete, blocking issues resolved, approver ${PAYROLL_ADMIN} chosen, rollback plan acknowledged. Pilot started with ${state.pilotSize} employees (Austin office).`}
            nextLabel="Start pilot"
            onContinue={() => setTab("monitor")}
          />
        )}
        {tab === "monitor" && (
          <MonitorScreen
            state={state}
            edgeCases={edgeCases}
            onResolveClick={(id) => setActiveIssueId(id)}
            onMerge={() => dispatch({ type: "merge" })}
            onKeepBoth={() => dispatch({ type: "keepBoth" })}
            onPauseClick={() => setPauseOpen(true)}
            onResume={() => dispatch({ type: "resume" })}
            onReconnect={() => toggleEdge("accessExpired")}
            onToggleWebhook={(event) => dispatch({ type: "toggleWebhook", event })}
          />
        )}

        <ResolvePanel
          issue={activeIssue}
          onClose={() => setActiveIssueId(null)}
          onRetry={(id) => dispatch({ type: "retry", recordId: id, fails: edgeCases.retryFails })}
          onOverride={(id, value, reason) => dispatch({ type: "override", recordId: id, value, reason })}
          onSkip={(id) => dispatch({ type: "skip", recordId: id })}
        />

        <Dialog open={pauseOpen} onClose={() => setPauseOpen(false)} title={`Pause syncing for ${state.pilotSize} employees?`}>
          <p>
            Syncing stops and data stays as it is. The open run for Fri, Nov 13 will use data from the last sync, {state.lastSyncAt}.
            Nothing is deleted.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" size="small" onClick={() => setPauseOpen(false)}>
              Keep syncing
            </Button>
            <Button
              variant="critical"
              size="small"
              onClick={() => {
                dispatch({ type: "pause" });
                setPauseOpen(false);
                setTab("monitor");
              }}
            >
              Pause sync
            </Button>
          </div>
        </Dialog>
      </AppShell>
    </LaptopFrame>
  );
}
