"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { INTEGRATION_ADMIN_EMAIL, INTEGRATION_SYSTEMS } from "@/lib/integration/data";
import { Banner } from "./ui";

export function ConnectScreen({
  connectedSystem,
  connectionFails,
  onConnect,
  onContinue,
}: {
  connectedSystem: string | null;
  connectionFails: boolean;
  onConnect: (system: string) => void;
  onContinue: () => void;
}) {
  const [pickedId, setPickedId] = useState(
    INTEGRATION_SYSTEMS.find((s) => s.name === connectedSystem)?.id ?? INTEGRATION_SYSTEMS[0].id
  );
  const [connecting, setConnecting] = useState(false);
  const [failed, setFailed] = useState(false);

  const picked = INTEGRATION_SYSTEMS.find((s) => s.id === pickedId)!;
  const isConnectedToPicked = connectedSystem === picked.name;

  function handleConnect() {
    setFailed(false);
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      if (connectionFails) {
        setFailed(true);
        return;
      }
      onConnect(picked.name);
    }, 900);
  }

  return (
    <div className="max-w-[640px]">
      <h1 className="text-[22px] font-bold tracking-tight text-text">Connect your ERP</h1>
      <p className="mt-1 text-[13px] text-muted">Start in sandbox. Nothing touches live payroll.</p>

      <div role="radiogroup" aria-label="System" className="mt-5 grid grid-cols-3 gap-3">
        {INTEGRATION_SYSTEMS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={pickedId === s.id}
            onClick={() => setPickedId(s.id)}
            className={`min-h-[88px] rounded-2xl border-[1.5px] p-4 text-left transition-colors ${
              pickedId === s.id ? "border-accent bg-accent-soft" : "border-border bg-surface hover:bg-surface-sunken"
            }`}
          >
            <div className="text-[12px] text-faint">{s.category}</div>
            <div className="mt-0.5 text-[15px] font-semibold text-text">{s.name}</div>
          </button>
        ))}
      </div>

      {failed && (
        <Banner tone="critical" className="mt-4">
          ✕ Couldn&rsquo;t reach {picked.name}. Check the address and try again.
        </Banner>
      )}

      {connecting && (
        <div role="status" className="mt-4">
          <div className="mb-2 text-[13px] font-medium text-text">Connecting to {picked.name} in sandbox…</div>
          <div className="h-2 overflow-hidden rounded-full bg-accent-soft">
            <div className="h-2 w-[70%] rounded-full bg-accent" />
          </div>
        </div>
      )}

      {isConnectedToPicked && !connecting && (
        <Banner tone="info" className="mt-4">
          ✓ Signed in as <span className="font-semibold">{INTEGRATION_ADMIN_EMAIL}</span> via company login &middot; connected to{" "}
          {connectedSystem} in sandbox
        </Banner>
      )}

      <div className="mt-5 flex items-center gap-3">
        {!isConnectedToPicked || failed ? (
          <Button onClick={handleConnect} disabled={connecting}>
            {connecting ? "Connecting…" : "Connect"}
          </Button>
        ) : (
          <Button onClick={onContinue}>Continue to permissions</Button>
        )}
      </div>
    </div>
  );
}
