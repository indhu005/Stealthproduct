// Mirrors the spec's section 1 state model. `stage` is set by explicit
// transitions (connect, go live, pause, reconnect) — unlike onboarding's
// per-field derivation, this state machine is driven by discrete admin
// actions, so it's fine for stage itself to be assigned directly. What's
// still *derived*, never set by hand, are canGoLive and payrollBlocked.

export type ConnectionStage = "disconnected" | "sandbox" | "tested" | "pilot" | "live" | "paused" | "error";

export type Confidence = "high" | "medium" | "review";

export interface FieldMapping {
  source: string;
  target: string;
  confidence: Confidence;
  status: "matched" | "needs_review" | "unmatched";
  note?: string;
}

export type IssueResolution = "fixed_in_source" | "override_in_product" | "skipped";

export interface SyncIssue {
  recordId: string;
  person: string;
  reason: string;
  blocksPayroll: boolean;
  resolution?: IssueResolution;
  resolutionDetail?: string; // override value, or who/how it was resolved — shown in the activity log
  retryCount: number;
  retryFailedReason?: string;
}

export interface Entity {
  id: string;
  name: string;
  included: boolean;
}

export interface Webhook {
  event: string;
  enabled: boolean;
  lastDelivery: "ok" | "failed" | "retrying";
}

export interface ActivityEntry {
  id: string;
  when: string;
  text: string;
}

export interface IntegrationState {
  stage: ConnectionStage;
  entities: Entity[];
  mappings: FieldMapping[];
  test: {
    checked: number;
    issues: SyncIssue[];
  };
  pilotSize: number;
  approver: string;
  lastSyncAt: string;
  webhooks: Webhook[];
  auditRetentionMonths: number;
  activity: ActivityEntry[];
  duplicateResolved: boolean;
  recordsSyncedToday: number;
  failuresToday: number;
}

export interface EdgeCaseToggles {
  accessExpired: boolean;
  retryFails: boolean;
  rateLimited: boolean;
  connectionFails: boolean;
}
