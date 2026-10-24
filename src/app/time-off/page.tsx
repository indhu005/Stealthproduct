"use client";

import { useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LaptopFrame } from "@/components/layout/LaptopFrame";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill, SeverityDot } from "@/components/ui/Badge";
import { SidePanel } from "@/components/ui/SidePanel";
import { Dialog } from "@/components/ui/Dialog";

type Status = "pending" | "approved" | "declined";
type LeaveType = "Vacation" | "Sick";
type DeclineReason = "Coverage conflict" | "Insufficient balance" | "Other";

type Request = {
  id: string;
  name: string;
  type: LeaveType;
  days: number;
  range: string;
  requestedOn: string;
  reason: string;
  balanceBefore: number;
  balanceAfter: number;
  conflict?: string;
  status: Status;
  declineReason?: DeclineReason;
};

const initialRequests: Request[] = [
  {
    id: "jane",
    name: "Jane Doe",
    type: "Vacation",
    days: 3,
    range: "Jul 2 – Jul 4",
    requestedOn: "Jun 20",
    reason: "Family trip",
    balanceBefore: 12,
    balanceAfter: 9,
    conflict: "Priya Nair is already approved out Jul 3–5 — 2 of 6 team members would be out that week.",
    status: "pending",
  },
  {
    id: "luis",
    name: "Luis Ortega",
    type: "Sick",
    days: 1,
    range: "Jun 28",
    requestedOn: "Jun 27",
    reason: "Doctor's appointment",
    balanceBefore: 8,
    balanceAfter: 7,
    status: "pending",
  },
  {
    id: "maya",
    name: "Maya Chen",
    type: "Vacation",
    days: 5,
    range: "Aug 11 – Aug 15",
    requestedOn: "Jun 18",
    reason: "Wedding",
    balanceBefore: 3,
    balanceAfter: -2,
    status: "pending",
  },
];

const declineReasons: DeclineReason[] = ["Coverage conflict", "Insufficient balance", "Other"];

export default function TimeOffPage() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [panelId, setPanelId] = useState<string | null>(null);
  const [declineDialogId, setDeclineDialogId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState<DeclineReason>("Coverage conflict");
  const [declineNote, setDeclineNote] = useState("");
  const [riskyApproveId, setRiskyApproveId] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const showToast = (message: string) => {
    setToast(message);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 2500);
  };

  const panelRequest = requests.find((r) => r.id === panelId) ?? null;
  const declineRequest = requests.find((r) => r.id === declineDialogId) ?? null;
  const riskyRequest = requests.find((r) => r.id === riskyApproveId) ?? null;

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  function setStatus(id: string, status: Status, declineReason?: DeclineReason) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status, declineReason } : r)));
  }

  function handleApproveClick(id: string, balanceAfter: number) {
    if (balanceAfter < 0) {
      setRiskyApproveId(id);
      return;
    }
    setStatus(id, "approved");
    setPanelId(null);
    showToast("Approved — employee notified by email");
  }

  function confirmRiskyApprove() {
    if (!riskyApproveId) return;
    setStatus(riskyApproveId, "approved");
    setRiskyApproveId(null);
    setPanelId(null);
    showToast("Approved anyway — employee notified by email");
  }

  function openDeclineDialog(id: string) {
    setDeclineReason("Coverage conflict");
    setDeclineNote("");
    setDeclineDialogId(id);
  }

  function confirmDecline() {
    if (!declineDialogId) return;
    setStatus(declineDialogId, "declined", declineReason);
    setDeclineDialogId(null);
    setPanelId(null);
    showToast("Declined — employee notified by email");
  }

  return (
    <LaptopFrame>
      <AppShell active="time-off">
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[21px] font-bold tracking-tight">Time off</h2>
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-faint">Concept</span>
          </div>
        </div>

        <p className="mb-1 text-[12.5px] text-muted">Requests needing admin review</p>
        <h1 className="mb-5 text-[26px] font-bold tracking-tight">
          {pending.length === 0 ? "All caught up" : `${pending.length} request${pending.length === 1 ? "" : "s"} pending review`}
        </h1>

        <Card className="mb-6 flex overflow-hidden">
          {[
            { n: String(pending.length), l: "Pending requests" },
            { n: String(requests.filter((r) => r.status === "approved").length), l: "Approved this cycle" },
            { n: String(requests.filter((r) => r.status === "declined").length), l: "Declined this cycle" },
            { n: "2", l: "Out this week" },
          ].map((s, i, arr) => (
            <div key={s.l} className={`flex-1 px-5 py-4 ${i !== arr.length - 1 ? "border-r border-border" : ""}`}>
              <div className="tabular-nums text-[21px] font-bold tracking-tight">{s.n}</div>
              <div className="mt-0.5 text-[12px] text-faint">{s.l}</div>
            </div>
          ))}
        </Card>

        {pending.length > 0 && (
          <>
            <h3 className="mb-2.5 text-[14px] font-bold">Needs your review</h3>
            <Card className="mb-6 overflow-hidden">
              {pending.map((r, i) => (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 p-4 ${i !== pending.length - 1 ? "border-b border-border" : ""}`}
                >
                  <SeverityDot severity={r.conflict || r.balanceAfter < 0 ? "warning" : "neutral"} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold">
                      {r.name} <span className="font-normal text-muted">&middot; {r.type}</span>
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-muted">
                      {r.days} day{r.days === 1 ? "" : "s"}, {r.range}
                    </div>
                    {r.balanceAfter < 0 && (
                      <p className="mt-1 text-[12px] font-semibold text-critical">Exceeds remaining balance</p>
                    )}
                    {!!r.conflict && r.balanceAfter >= 0 && (
                      <p className="mt-1 text-[12px] text-warning">Team overlap flagged</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <Button variant="ghost" size="small" onClick={() => openDeclineDialog(r.id)}>
                      Decline
                    </Button>
                    <Button size="small" onClick={() => handleApproveClick(r.id, r.balanceAfter)}>
                      Approve
                    </Button>
                  </div>
                  <button
                    onClick={() => setPanelId(r.id)}
                    className="ml-1 shrink-0 text-[12.5px] font-semibold text-accent-ink underline"
                  >
                    View
                  </button>
                </div>
              ))}
            </Card>
          </>
        )}

        {resolved.length > 0 && (
          <>
            <h3 className="mb-2.5 text-[14px] font-bold">Recently resolved</h3>
            <Card className="mb-6 overflow-hidden">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-faint">
                    <th className="px-4 py-2.5 font-semibold">Employee</th>
                    <th className="px-4 py-2.5 font-semibold">Request</th>
                    <th className="px-4 py-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resolved.map((r, i, arr) => (
                    <tr key={r.id} className={i !== arr.length - 1 ? "border-b border-border" : ""}>
                      <td className="px-4 py-3 text-[13.5px] font-semibold">{r.name}</td>
                      <td className="px-4 py-3 text-[13px] text-muted">
                        {r.type}, {r.days} day{r.days === 1 ? "" : "s"} &middot; {r.range}
                      </td>
                      <td className="px-4 py-3">
                        {r.status === "approved" ? (
                          <Pill tone="success" className="ml-0">
                            Approved
                          </Pill>
                        ) : (
                          <Pill tone="critical" className="ml-0">
                            Declined{r.declineReason ? ` — ${r.declineReason}` : ""}
                          </Pill>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        <p className="mt-2 max-w-[70ch] text-[11.5px] leading-relaxed text-faint">
          Concept flow with fake data. Balance and conflict calculations are illustrative.
        </p>

        <SidePanel open={!!panelRequest} onClose={() => setPanelId(null)} title={panelRequest ? `${panelRequest.name} · ${panelRequest.type}` : ""}>
          {panelRequest && (
            <div className="flex flex-1 flex-col gap-6">
              <div>
                <div className="mb-1 text-[12.5px] font-bold text-faint">Request</div>
                <p className="text-[13.5px] font-semibold">
                  {panelRequest.days} day{panelRequest.days === 1 ? "" : "s"}, {panelRequest.range}
                </p>
                <p className="mt-0.5 text-[12.5px] text-muted">Requested {panelRequest.requestedOn} &middot; &ldquo;{panelRequest.reason}&rdquo;</p>
              </div>

              <div>
                <div className="mb-1 text-[12.5px] font-bold text-faint">PTO balance</div>
                <p className="tabular-nums text-[18px] font-bold text-text">
                  {panelRequest.balanceBefore} &rarr; {panelRequest.balanceAfter}{" "}
                  <span className="text-[12px] font-normal text-muted">days remaining</span>
                </p>
                {panelRequest.balanceAfter < 0 && (
                  <p className="mt-1.5 rounded-lg border border-critical/30 bg-critical-soft p-2.5 text-[12.5px] text-critical">
                    This request uses more days than {panelRequest.name.split(" ")[0]} has available. Approving will leave the balance negative.
                  </p>
                )}
              </div>

              {panelRequest.conflict && (
                <div>
                  <div className="mb-1 text-[12.5px] font-bold text-faint">Team coverage</div>
                  <p className="rounded-lg border border-warning/30 bg-warning-soft p-2.5 text-[12.5px] text-warning">
                    {panelRequest.conflict}
                  </p>
                </div>
              )}

              <div className="mt-auto flex items-center gap-4 border-t border-border pt-4">
                <Button variant="ghost" onClick={() => openDeclineDialog(panelRequest.id)}>
                  Decline
                </Button>
                <Button onClick={() => handleApproveClick(panelRequest.id, panelRequest.balanceAfter)}>
                  Approve
                </Button>
              </div>
            </div>
          )}
        </SidePanel>

        <Dialog open={!!declineRequest} onClose={() => setDeclineDialogId(null)} title="Decline this request?">
          {declineRequest && (
            <>
              <p>
                {declineRequest.name} will be notified by email that their {declineRequest.type.toLowerCase()} request for{" "}
                {declineRequest.range} was declined.
              </p>
              <div className="mt-3 flex flex-col gap-1.5">
                {declineReasons.map((reason) => (
                  <label key={reason} className="flex items-center gap-2 text-[13px] text-text">
                    <input
                      type="radio"
                      name="decline-reason"
                      checked={declineReason === reason}
                      onChange={() => setDeclineReason(reason)}
                    />
                    {reason}
                  </label>
                ))}
              </div>
              <textarea
                value={declineNote}
                onChange={(e) => setDeclineNote(e.target.value)}
                placeholder="Optional note to employee"
                rows={2}
                className="mt-2.5 w-full rounded-lg border border-border bg-surface p-2.5 text-[12.5px] text-text placeholder:text-faint focus:outline-none"
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" size="small" onClick={() => setDeclineDialogId(null)}>
                  Cancel
                </Button>
                <Button variant="critical" size="small" onClick={confirmDecline}>
                  Decline request
                </Button>
              </div>
            </>
          )}
        </Dialog>

        <Dialog open={!!riskyRequest} onClose={() => setRiskyApproveId(null)} title="Approve with negative balance?">
          {riskyRequest && (
            <>
              <p>
                {riskyRequest.name} only has {riskyRequest.balanceBefore} day{riskyRequest.balanceBefore === 1 ? "" : "s"} remaining, so
                approving this request will leave their balance at {riskyRequest.balanceAfter}. May need adjustment or an unpaid-leave
                conversion later.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" size="small" onClick={() => setRiskyApproveId(null)}>
                  Cancel
                </Button>
                <Button size="small" onClick={confirmRiskyApprove}>
                  Approve anyway
                </Button>
              </div>
            </>
          )}
        </Dialog>

        {toast && (
          <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
            <div className="flex items-center gap-2 rounded-lg bg-[#1a1b1f] px-4 py-2.5 text-[12.5px] font-medium text-white shadow-card">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-success">
                <circle cx="8" cy="8" r="7" fill="currentColor" fillOpacity="0.2" />
                <path d="M5 8.3L7 10.3L11 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {toast}
            </div>
          </div>
        )}
      </AppShell>
    </LaptopFrame>
  );
}
