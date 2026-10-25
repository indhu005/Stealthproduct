import type { IntegrationState, SyncIssue } from "./types";

export function isResolved(issue: SyncIssue): boolean {
  return issue.resolution !== undefined;
}

export function unresolvedIssues(state: IntegrationState): SyncIssue[] {
  return state.test.issues.filter((i) => !isResolved(i));
}

export function readyCount(state: IntegrationState): number {
  return state.test.checked - unresolvedIssues(state).length;
}

export function needsAttentionCount(state: IntegrationState): number {
  return unresolvedIssues(state).length;
}

export function blockingCount(state: IntegrationState): number {
  return unresolvedIssues(state).filter((i) => i.blocksPayroll).length;
}

// Never set by hand — always recomputed from the current issue list and
// approver, so the Go-live gate can't drift out of sync with reality.
export function payrollBlocked(state: IntegrationState): boolean {
  return blockingCount(state) > 0;
}

export function canGoLive(state: IntegrationState): boolean {
  return !payrollBlocked(state) && !!state.approver && state.rollbackAcknowledged;
}

export function unresolvedMappings(state: IntegrationState) {
  return state.mappings.filter((m) => m.status === "needs_review");
}

export function canRunTestSync(state: IntegrationState): boolean {
  return unresolvedMappings(state).length === 0;
}
