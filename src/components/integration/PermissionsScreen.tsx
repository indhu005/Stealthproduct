"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SCOPE_GROUPS } from "@/lib/integration/data";
import type { Entity } from "@/lib/integration/types";

export function PermissionsScreen({
  entities,
  auditRetentionMonths,
  onToggleEntity,
  onContinue,
}: {
  entities: Entity[];
  auditRetentionMonths: number;
  onToggleEntity: (id: string) => void;
  onContinue: () => void;
}) {
  const [writesOn, setWritesOn] = useState<Record<string, boolean>>({
    "write-results": true,
    "write-statements": true,
  });

  const includedCount = entities.filter((e) => e.included).length;
  const canContinue = includedCount > 0;

  return (
    <div className="max-w-[760px]">
      <h1 className="text-[22px] font-bold tracking-tight text-text">What this connection can do</h1>
      <p className="mt-1 text-[13px] text-muted">Remove optional access you don&rsquo;t need.</p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {SCOPE_GROUPS.map((g) => (
          <div key={g.title} className="rounded-2xl border border-border p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-faint">{g.title}</div>
            <div className="mt-1 flex flex-col">
              {g.items.map((item) => {
                const on = item.locked ? true : writesOn[item.id];
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 border-t border-border py-2.5 first:border-t-0">
                    <div>
                      <div className="text-[13.5px] font-semibold text-text">{item.name}</div>
                      <div className="text-[11.5px] text-faint">{item.why}</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={item.name}
                      disabled={item.locked}
                      onClick={() => setWritesOn((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={`shrink-0 rounded-full border-[1.5px] px-3 py-1.5 text-[11px] font-semibold ${
                        on ? "border-accent bg-accent-soft text-accent-ink" : "border-border text-faint"
                      } ${item.locked ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                    >
                      {item.locked ? "Required" : on ? "On" : "Off"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border p-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-faint">Legal entities to include</div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {entities.map((e) => (
            <label
              key={e.id}
              className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] px-4 text-[13.5px] font-medium ${
                e.included ? "border-accent bg-accent-soft" : "border-border"
              }`}
            >
              <input
                type="checkbox"
                checked={e.included}
                onChange={() => onToggleEntity(e.id)}
                className="h-[18px] w-[18px] accent-accent"
              />
              {e.name}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5 text-[12.5px]">
        <span className="rounded-full bg-accent-soft px-3 py-2 text-accent-ink">✓ You can revoke access anytime</span>
        <span className="rounded-full bg-accent-soft px-3 py-2 text-accent-ink">
          ✓ Every change is logged and kept for {auditRetentionMonths} months
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={onContinue} disabled={!canContinue}>
          Approve and continue
        </Button>
        {!canContinue && <span className="text-[12.5px] text-faint">Select at least one entity to continue.</span>}
      </div>
    </div>
  );
}
