"use client";

import { Button } from "@/components/ui/Button";
import { INTEGRATION_APPROVERS } from "@/lib/integration/data";

export function GoLiveScreen({
  pilotSize,
  approver,
  rollbackAcknowledged,
  canStart,
  onPilotStep,
  onSetApprover,
  onToggleAck,
  onStartPilot,
}: {
  pilotSize: number;
  approver: string;
  rollbackAcknowledged: boolean;
  canStart: boolean;
  onPilotStep: (delta: number) => void;
  onSetApprover: (name: string) => void;
  onToggleAck: () => void;
  onStartPilot: () => void;
}) {
  return (
    <div className="max-w-[560px]">
      <h1 className="text-[22px] font-bold tracking-tight text-text">Go live</h1>
      <p className="mt-1 text-[13px] text-muted">Mapping complete, blocking issues resolved. Choose how to start.</p>

      <div className="mt-5 flex items-center justify-between rounded-2xl border border-border p-4">
        <div>
          <div className="text-[13.5px] font-semibold text-text">Pilot size</div>
          <div className="text-[11.5px] text-faint">Austin office</div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Fewer employees"
            onClick={() => onPilotStep(-10)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-[18px]"
          >
            −
          </button>
          <b className="min-w-[40px] text-center text-[15px]">{pilotSize}</b>
          <button
            type="button"
            aria-label="More employees"
            onClick={() => onPilotStep(10)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-[18px]"
          >
            +
          </button>
        </div>
      </div>

      <div role="radiogroup" aria-label="Approver" className="mt-4">
        <div className="text-[13px] font-semibold text-text">Approver</div>
        <div className="mt-2 flex gap-2">
          {INTEGRATION_APPROVERS.map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={approver === name}
              onClick={() => onSetApprover(name)}
              className={`flex-1 min-h-[48px] rounded-xl border-[1.5px] text-[14px] font-medium ${
                approver === name ? "border-accent bg-accent-soft" : "border-border"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-4 flex min-h-[44px] items-center gap-3 text-[14px] text-text">
        <input
          type="checkbox"
          checked={rollbackAcknowledged}
          onChange={onToggleAck}
          className="h-[22px] w-[22px] accent-accent"
        />
        I understand how to roll back: pause sync, data stays as it is.
      </label>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={onStartPilot} disabled={!canStart}>
          Start pilot
        </Button>
        {!canStart && (
          <span className="text-[12.5px] text-faint">
            {!approver ? "Choose an approver to continue." : !rollbackAcknowledged ? "Acknowledge the rollback plan to continue." : "Resolve blocking issues to continue."}
          </span>
        )}
      </div>
    </div>
  );
}
