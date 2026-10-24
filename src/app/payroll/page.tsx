"use client";

import { useReducer, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LaptopFrame } from "@/components/layout/LaptopFrame";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill, StatusChip, type PayrollStage } from "@/components/ui/Badge";
import { SidePanel } from "@/components/ui/SidePanel";
import { Dialog } from "@/components/ui/Dialog";

// Ported from the design system handoff: one `stage` drives everything else.
type Screen = "overview" | "draft" | "review" | "record";
type FormOption = "send" | "fill" | "upload";

type State = {
  stage: PayrollStage;
  screen: Screen;
  viaDefault: boolean;
  reminded: boolean;
  formOption: FormOption;
};

type Action =
  | { type: "goToScreen"; screen: Screen }
  | { type: "selectFormOption"; option: FormOption }
  | { type: "submitStep2" } // Send request / Fill in / Upload — all land on "requested"
  | { type: "remind" }
  | { type: "devReturnsForm" }
  | { type: "approveDefault" }
  | { type: "previewPayroll" }
  | { type: "approvePayroll" }
  | { type: "backToDraft" }
  | { type: "reset" };

const initialState: State = {
  stage: "blocked",
  screen: "overview",
  viaDefault: false,
  reminded: false,
  formOption: "send",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "goToScreen":
      return { ...state, screen: action.screen };
    case "selectFormOption":
      return { ...state, formOption: action.option };
    case "submitStep2":
      return { ...state, stage: "requested", reminded: false };
    case "remind":
      return { ...state, reminded: true };
    case "devReturnsForm":
      return { ...state, stage: "resolved", viaDefault: false, screen: "draft" };
    case "approveDefault":
      return { ...state, stage: "resolved", viaDefault: true, screen: "draft" };
    case "previewPayroll":
      return { ...state, screen: "review" };
    case "approvePayroll":
      return { ...state, stage: "approved", screen: "record" };
    case "backToDraft":
      return { ...state, screen: "draft" };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

const colleagues = [
  { name: "Maya Chen", state: "WA", gross: 6100, taxes: 1020, net: 5080 },
  { name: "Luis Ortega", state: "TX", gross: 4800, taxes: 690, net: 4110 },
  { name: "Priya Nair", state: "CA", gross: 7300, taxes: 1540, net: 5760 },
  { name: "Tom Becker", state: "WA", gross: 5900, taxes: 960, net: 4920 },
];

const DEV_NET_BEFORE = 4420;
const DEV_NET_AFTER = 4210;
const DEV_NET_BEFORE_FMT = DEV_NET_BEFORE.toLocaleString();
const DEV_NET_AFTER_FMT = DEV_NET_AFTER.toLocaleString();

const formOptions: { id: FormOption; label: string; blurb: string; ctaLabel: string }[] = [
  { id: "send", label: "Send request to Dev", blurb: "Recommended. He fills in the DE 4 himself.", ctaLabel: "Send request to Dev" },
  { id: "fill", label: "Fill in on his behalf", blurb: "You enter his details. He signs later.", ctaLabel: "Save and notify Dev" },
  { id: "upload", label: "Upload a completed form", blurb: "Attach a signed DE 4 (PDF).", ctaLabel: "Upload form" },
];

export default function PayrollPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [panelOpen, setPanelOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { stage, screen, viaDefault, reminded, formOption } = state;

  // Dev's phone is its own small flow — notification → email → sign-in → the
  // DE 4 form itself → confirmation — mirrored from the source prototype.
  type PhoneView = "idle" | "notification" | "email" | "signin" | "form" | "submitted";
  const [phoneView, setPhoneView] = useState<PhoneView>("idle");
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");
  const [formConfirmed, setFormConfirmed] = useState(false);

  // Derived-state reset on `stage` change, done during render per React's
  // guidance (no effect needed/wanted here — this is resetting local UI state
  // to track an external value, not synchronizing with an outside system).
  const [prevStage, setPrevStage] = useState(stage);
  if (stage !== prevStage) {
    setPrevStage(stage);
    if (stage === "blocked") {
      setPhoneView("idle");
      setFilingStatus("single");
      setFormConfirmed(false);
    } else if (stage === "requested") {
      if (phoneView === "idle" || phoneView === "submitted") setPhoneView("notification");
    } else {
      setPhoneView("submitted");
    }
  }

  const canPreview = stage === "resolved" || stage === "approved";
  const showAiCard = canPreview;

  const totalNet = colleagues.reduce((sum, c) => sum + c.net, 0) + (canPreview ? DEV_NET_AFTER : DEV_NET_BEFORE);

  // Dev's phone — a separate companion view, not part of the admin dashboard
  // itself. Rendered as a flex sibling of the laptop bezel (see LaptopFrame's
  // `aside` prop) so it's centered alongside it and reflows on narrow screens
  // instead of being pinned to a viewport-relative offset.
  const phoneWidget = (
    <div className="flex w-[260px] flex-col items-center">
      <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-faint">Dev&rsquo;s phone</div>
      <div className="w-full rounded-[40px] bg-[#1a1b1f] p-2.5 shadow-card">
        <div className="flex w-full min-h-[460px] flex-col overflow-hidden rounded-[30px] bg-white">
          {/* Status bar */}
          <div className="relative flex items-center justify-between px-4 pb-1 pt-2.5 text-[10px] font-semibold text-[#17181c]">
            <span>9:41</span>
            <span className="absolute left-1/2 top-1.5 h-[18px] w-[70px] -translate-x-1/2 rounded-full bg-[#1a1b1f]" />
            <span>5G</span>
          </div>

          <div className="flex flex-1 flex-col px-3 pb-4 pt-2">
            {phoneView === "idle" && (
              <>
                <div className="mb-2 text-[13px] font-bold text-[#17181c]">Inbox</div>
                <p className="mt-10 text-center text-[11px] text-[#8a8fa0]">
                  No new messages. Bolto will email you if something needs your action.
                </p>
              </>
            )}

            {phoneView === "notification" && (
              <>
                <div className="mb-2 text-[13px] font-bold text-[#17181c]">Inbox</div>
                <button onClick={() => setPhoneView("email")} className="rounded-lg bg-[#e9eeff] p-2.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#1a3bb0]">Bolto</span>
                    <span className="text-[9px] text-[#8a8fa0]">now</span>
                  </div>
                  <div className="mt-1 text-[11px] font-bold text-[#17181c]">Something needs your action</div>
                  <p className="mt-1 text-[10px] leading-relaxed text-[#5a5e6b]">Open the app to see what&rsquo;s pending.</p>
                </button>
              </>
            )}

            {phoneView === "email" && (
              <>
                <button onClick={() => setPhoneView("notification")} className="mb-2.5 self-start text-[10.5px] font-semibold text-[#2f62f5]">
                  &lsaquo; Inbox
                </button>
                <p className="text-[9px] text-[#8a8fa0]">From Bolto &middot; to dev.patel@example.com</p>
                <div className="mt-1.5 text-[13px] font-bold leading-snug text-[#17181c]">Something needs your action</div>
                <p className="mt-2 text-[10px] leading-relaxed text-[#5a5e6b]">
                  Hi Dev, open Bolto to see what&rsquo;s pending and take care of it.
                </p>
                <button
                  onClick={() => setPhoneView("signin")}
                  className="mt-3 rounded-md bg-[#2f62f5] px-2.5 py-2 text-center text-[10.5px] font-semibold text-white"
                >
                  Open Bolto
                </button>
                <p className="mt-1.5 text-[9px] text-[#8a8fa0]">Link opens bolto.com/sign-in</p>
              </>
            )}

            {phoneView === "signin" && (
              <>
                <div className="mb-4 text-[14px] font-bold text-[#2f62f5]">bolto&#9889;</div>
                <div className="mb-3 text-[13px] font-bold text-[#17181c]">Sign in</div>
                <div className="rounded-md border border-[#ebebf0] px-2.5 py-2 text-[10px] text-[#8a8fa0]">dev.patel@example.com</div>
                <div className="mt-2 rounded-md border border-[#ebebf0] px-2.5 py-2 text-[10px] tracking-widest text-[#8a8fa0]">
                  &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                </div>
                <button
                  onClick={() => setPhoneView("form")}
                  className="mt-3 rounded-md bg-[#2f62f5] px-2.5 py-2 text-center text-[10.5px] font-semibold text-white"
                >
                  Sign in
                </button>
                <button
                  onClick={() => setPhoneView("form")}
                  className="mt-2 rounded-md border border-[#ebebf0] px-2.5 py-2 text-center text-[10.5px] font-semibold text-[#2f62f5]"
                >
                  Use Face ID
                </button>
              </>
            )}

            {phoneView === "form" && (
              <>
                <p className="text-[9px] text-[#8a8fa0]">Step 1 of 1 &middot; due Wed</p>
                <div className="mt-1 text-[13px] font-bold text-[#17181c]">California DE 4</div>

                <p className="mt-3 text-[9.5px] font-semibold text-[#8a8fa0]">Filing status</p>
                <div className="mt-1 flex gap-1.5">
                  {(["single", "married"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setFilingStatus(v)}
                      className={`rounded-md border px-2.5 py-1.5 text-[10.5px] font-semibold capitalize ${
                        filingStatus === v ? "border-[#2f62f5] text-[#2f62f5]" : "border-[#ebebf0] text-[#5a5e6b]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-[9.5px] font-semibold text-[#8a8fa0]">Extra withholding per paycheck</p>
                <div className="mt-1 rounded-md border border-[#ebebf0] px-2.5 py-2 text-[10px] text-[#8a8fa0]">$0.00</div>

                <label className="mt-3 flex items-start gap-1.5 text-[9.5px] leading-snug text-[#17181c]">
                  <input
                    type="checkbox"
                    checked={formConfirmed}
                    onChange={(e) => setFormConfirmed(e.target.checked)}
                    className="mt-0.5"
                  />
                  I confirm this is correct. Typed signature: Dev Patel
                </label>

                <div className="mt-2.5 rounded-md bg-[#fdf0e3] p-2 text-[9.5px] text-[#5a5e6b]">
                  Your take-home will drop by about $210 per paycheck.
                </div>

                <button
                  disabled={!formConfirmed}
                  onClick={() => {
                    dispatch({ type: "devReturnsForm" });
                    setPhoneView("submitted");
                  }}
                  className="mt-3 rounded-md bg-[#2f62f5] px-2.5 py-2 text-center text-[10.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Submit form
                </button>
              </>
            )}

            {phoneView === "submitted" && (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5e0] text-[16px] text-[#3f9a2a]">
                  &#10003;
                </div>
                <div className="mt-3 text-[13px] font-bold text-[#17181c]">Form submitted</div>
                <p className="mt-1.5 text-[10px] leading-relaxed text-[#5a5e6b]">
                  Thanks, Dev. Your employer has been notified. Net pay changes by about &minus;$210 starting Oct 30.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <LaptopFrame aside={phoneWidget}>
    <AppShell active="payroll">
      <div aria-live="polite" className="sr-only">
        {stage === "blocked" && "1 issue blocks Friday's payroll"}
        {stage === "requested" && "Waiting on 1 form before Friday"}
        {stage === "resolved" && "CA form ready for Dev Patel"}
        {stage === "approved" && "Payroll approved"}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[21px] font-bold tracking-tight">Payroll</h2>
          <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-faint">Concept</span>
        </div>

        <div className="flex items-center gap-2">
          {([
            ["overview", "1 Overview"],
            ["draft", "2 Draft"],
            ["review", "3 Review"],
            ["record", "4 Record"],
          ] as [Screen, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => dispatch({ type: "goToScreen", screen: id })}
              className={`rounded-md px-3 py-1.5 text-[14px] font-semibold transition-colors ${
                screen === id ? "bg-accent-soft-border text-accent-ink" : "text-muted hover:text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {screen === "overview" && (
        <OverviewScreen
          stage={stage}
          reminded={reminded}
          onResolve={() => setPanelOpen(true)}
        />
      )}

      {screen === "draft" && (
        <DraftScreen
          canPreview={canPreview}
          devNet={canPreview ? DEV_NET_AFTER : null}
          onOpenPanel={() => setPanelOpen(true)}
          onPreview={() => dispatch({ type: "previewPayroll" })}
          showAiCard={showAiCard}
        />
      )}

      {screen === "review" && (
        <ReviewScreen
          canPreview={canPreview}
          totalNet={totalNet}
          onApprove={() => dispatch({ type: "approvePayroll" })}
          onBack={() => dispatch({ type: "backToDraft" })}
          onGoOverview={() => dispatch({ type: "goToScreen", screen: "overview" })}
        />
      )}

      {screen === "record" && (
        <RecordScreen
          approved={stage === "approved"}
          viaDefault={viaDefault}
          showAiCard={showAiCard}
          onGoOverview={() => dispatch({ type: "goToScreen", screen: "overview" })}
        />
      )}

      <p className="mt-8 max-w-[70ch] text-[11.5px] leading-relaxed text-faint">
        Concept flow with fake data. Tax rules and amounts are illustrative; confirm with compliance before shipping.
      </p>

      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title="Dev Patel · CA tax form">
        <div className="flex flex-1 flex-col gap-6">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[12.5px] font-bold text-faint">1 &middot; Company registration in California</span>
            </div>
            <div className="flex items-center gap-2">
              <Pill tone="neutral" className="ml-0">
                Read-only
              </Pill>
              <span className="text-[12.5px] text-text">Bolto is handling this. Estimated Nov 3.</span>
            </div>
            <p className="mt-1 text-[12px] text-faint">No action needed from you.</p>
          </div>

          <div>
            <div className="mb-2 text-[12.5px] font-bold text-faint">2 &middot; Employee tax form (DE 4)</div>

            {stage === "blocked" && (
              <>
                <div className="flex flex-col gap-2">
                  {formOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => dispatch({ type: "selectFormOption", option: opt.id })}
                      className={`rounded-lg border p-2.5 text-left transition-colors ${
                        formOption === opt.id ? "border-accent bg-accent-soft" : "border-border hover:bg-surface-sunken"
                      }`}
                    >
                      <div className="text-[13px] font-semibold">{opt.label}</div>
                      <div className="text-[11.5px] text-muted">{opt.blurb}</div>
                    </button>
                  ))}
                </div>
                <Button className="mt-3 w-full" onClick={() => dispatch({ type: "submitStep2" })}>
                  {formOptions.find((o) => o.id === formOption)?.ctaLabel}
                </Button>
              </>
            )}

            {stage === "requested" && (
              <div>
                <p className="text-[13px] font-semibold">Request sent to Dev. Due Wednesday.</p>
                <p className="mt-0.5 text-[12px] text-muted">Auto-reminders: Mon and Tue 9:00.</p>
                <div className="mt-2.5 flex gap-2">
                  <Button size="small" variant="secondary" onClick={() => dispatch({ type: "remind" })}>
                    Remind
                  </Button>
                  <Button size="small" variant="secondary" onClick={() => dispatch({ type: "devReturnsForm" })}>
                    Demo: Dev returns form
                  </Button>
                </div>
                {reminded && <p className="mt-2 text-[12px] text-muted">Reminder sent just now.</p>}

                <div className="mt-4 border-t border-border pt-3">
                  <div className="text-[12.5px] font-bold">Escape hatch</div>
                  <p className="mt-0.5 text-[12px] text-muted">
                    Run with default California withholding. Needs admin approval. May need adjustment later.
                  </p>
                  <button onClick={() => setDialogOpen(true)} className="mt-1.5 text-[13px] font-semibold text-accent-ink underline">
                    Run with default withholding
                  </button>
                </div>
              </div>
            )}

            {canPreview && (
              <div className="rounded-lg border border-success/30 bg-success-soft p-2.5 text-[13px] font-semibold text-success">
                Resolved. Form received{viaDefault ? " — default withholding applied" : ""}.
              </div>
            )}
          </div>

          <div>
            <div className="mb-1 text-[12.5px] font-bold text-faint">3 &middot; Impact preview</div>
            {canPreview ? (
              <>
                <p className="tabular-nums text-[18px] font-bold text-text">
                  $0 → ~$210{" "}
                  <span className="text-[12px] font-normal text-muted">state withholding per pay period</span>
                </p>
                <p className="mt-1 text-[12.5px] text-muted">
                  Dev&rsquo;s net pay will drop from ${DEV_NET_BEFORE.toLocaleString()} to about ${DEV_NET_AFTER.toLocaleString()}. We&rsquo;ll notify him by email.
                </p>
              </>
            ) : (
              <p className="text-[12.5px] text-faint">Unavailable until the CA tax form is set up.</p>
            )}
          </div>
        </div>
      </SidePanel>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Approve default withholding?">
        <p>Payroll will use California&rsquo;s default rate for Dev until his form arrives. May need adjustment later. Admin approval required.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" size="small" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            size="small"
            onClick={() => {
              dispatch({ type: "approveDefault" });
              setDialogOpen(false);
              setPanelOpen(false);
            }}
          >
            Approve as Omaid
          </Button>
        </div>
      </Dialog>
    </AppShell>
    </LaptopFrame>
  );
}

function OverviewScreen({
  stage,
  reminded,
  onResolve,
}: {
  stage: PayrollStage;
  reminded: boolean;
  onResolve: () => void;
}) {
  const pendingActions = stage === "blocked" ? 13 : stage === "requested" ? 12 : 0;

  return (
    <>
      <p className="mb-1 text-[12.5px] text-muted">Pay period Oct 12 – Oct 25 &middot; Payday Fri Oct 30</p>
      <h1 className="mb-5 text-[26px] font-bold tracking-tight">
        {stage === "blocked" && "1 issue blocks Friday’s payroll"}
        {stage === "requested" && "Waiting on 1 form before Friday"}
        {(stage === "resolved" || stage === "approved") && "Ready to run Friday’s payroll"}
      </h1>

      {stage !== "resolved" && stage !== "approved" ? (
        <>
          <h3 className="mb-2.5 text-[14px] font-bold">Needs your action</h3>
          <Card
            className={`flex items-start justify-between gap-4 p-4 ${
              stage === "blocked" ? "border-critical/30 bg-critical-soft" : "border-warning/30 bg-warning-soft"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-surface text-[14px] font-bold ${
                  stage === "blocked" ? "border-critical text-critical" : "border-warning text-warning"
                }`}
              >
                {stage === "blocked" ? "!" : "···"}
              </span>
              <div>
                <div className="text-[14.5px] font-bold">{stage === "blocked" ? "Dev Patel moved to California" : "Request sent to Dev Patel"}</div>
                <p className="mt-0.5 max-w-[48ch] text-[13px] text-muted">
                  {stage === "blocked"
                    ? "Dev Patel moved to California on Oct 15. A California tax form is needed to calculate his pay."
                    : "Dev has until Wednesday to complete his DE 4. Payroll stays blocked until it arrives."}
                </p>
                <p className="mt-1 text-[12px] text-faint">
                  {stage === "blocked" ? "Blocks payroll due Fri Oct 30" : "Due Wed Oct 28 · Payroll due Fri Oct 30"}
                </p>
                {reminded && stage === "requested" && <p className="mt-1 text-[12px] text-muted">Reminder sent just now.</p>}
              </div>
            </div>
            {stage === "blocked" && <Button onClick={onResolve}>Resolve →</Button>}
            {stage === "requested" && (
              <Button variant="secondary" onClick={onResolve}>
                View details
              </Button>
            )}
          </Card>
        </>
      ) : (
        <Card className="border-success/30 bg-success-soft p-4 text-[13.5px] text-success">
          <StatusChip stage={stage} className="ml-0" /> — continue to Draft to preview and approve this run.
        </Card>
      )}

      <div className="mb-2.5 mt-6 text-[11px] font-semibold uppercase tracking-wider text-faint">At a glance</div>
      <Card className="flex overflow-hidden">
        {[
          { n: "Oct 30", l: "Next payroll date" },
          { n: "87", l: "Active employees" },
          { n: "$21,300", l: "Period employer cost" },
          { n: String(pendingActions), l: "Pending actions" },
        ].map((s, i, arr) => (
          <div key={s.l} className={`flex-1 px-5 py-4 ${i !== arr.length - 1 ? "border-r border-border" : ""}`}>
            <div className="tabular-nums text-[21px] font-bold tracking-tight">{s.n}</div>
            <div className="mt-0.5 text-[12px] text-faint">{s.l}</div>
          </div>
        ))}
      </Card>
    </>
  );
}

function DraftScreen({
  canPreview,
  devNet,
  onOpenPanel,
  onPreview,
  showAiCard,
}: {
  canPreview: boolean;
  devNet: number | null;
  onOpenPanel: () => void;
  onPreview: () => void;
  showAiCard: boolean;
}) {
  return (
    <>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="mb-1 text-[12.5px] text-muted">Draft &middot; Due Fri Oct 30</p>
          <h1 className="text-[26px] font-bold tracking-tight">Draft payroll</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button disabled={!canPreview} onClick={onPreview} title={canPreview ? undefined : "Resolve Dev's CA tax form first"}>
            Preview payroll
          </Button>
          <span className="max-w-[26ch] text-right text-[12px] text-faint">
            {canPreview ? "Ready to preview. Dev’s change is flagged for review." : "🔒 Locked until Dev Patel’s California tax form is in."}
          </span>
        </div>
      </div>

      <Card
        className={`mb-4 flex items-center justify-between p-3 text-[13px] font-semibold ${
          canPreview ? "border-success/30 bg-success-soft text-success" : "border-critical/30 bg-critical-soft text-critical"
        }`}
      >
        {canPreview ? "All employees ready. Preview unlocked." : "1 employee blocked. Resolve to preview."}
        {!canPreview && (
          <Button size="small" variant="secondary" onClick={onOpenPanel}>
            Resolve
          </Button>
        )}
      </Card>

      <Card className="mb-6 overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wider text-faint">
              <th className="px-4 py-2.5 font-semibold">Employee</th>
              <th className="px-4 py-2.5 font-semibold">State</th>
              <th className="px-4 py-2.5 font-semibold">Gross</th>
              <th className="px-4 py-2.5 font-semibold">Taxes</th>
              <th className="px-4 py-2.5 font-semibold">Net pay</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-[13.5px] font-semibold">Maya Chen</td>
              <td className="px-4 py-3 text-[13px] text-muted">WA</td>
              <td className="tabular-nums px-4 py-3 text-[13px] text-muted">$6,100</td>
              <td className="tabular-nums px-4 py-3 text-[13px] text-muted">$1,020</td>
              <td className="tabular-nums px-4 py-3 text-[13.5px] font-semibold">$5,080</td>
              <td className="px-4 py-3">
                <Pill tone="success" className="ml-0">
                  Ready
                </Pill>
              </td>
            </tr>
            <tr onClick={onOpenPanel} className={`cursor-pointer border-b border-border ${canPreview ? "bg-success-soft" : "bg-critical-soft"}`}>
              <td className="px-4 py-3 text-[13.5px] font-bold">Dev Patel</td>
              <td className="px-4 py-3 text-[13px] text-muted">WA → CA</td>
              <td className="tabular-nums px-4 py-3 text-[13px] text-muted">$5,200</td>
              <td className="tabular-nums px-4 py-3 text-[13px] text-muted">{canPreview ? "$780" : "–"}</td>
              <td className="tabular-nums px-4 py-3 text-[13.5px] font-bold">{devNet === null ? "–" : `$${devNet.toLocaleString()}`}</td>
              <td className="px-4 py-3">
                <StatusChip stage={canPreview ? "resolved" : "blocked"} className="ml-0" />
              </td>
            </tr>
            {[
              { name: "Luis Ortega", state: "TX", gross: 4800, taxes: 690, net: 4110 },
              { name: "Priya Nair", state: "CA", gross: 7300, taxes: 1540, net: 5760 },
              { name: "Tom Becker", state: "WA", gross: 5900, taxes: 960, net: 4920 },
            ].map((e, i, arr) => (
              <tr key={e.name} className={i !== arr.length - 1 ? "border-b border-border" : ""}>
                <td className="px-4 py-3 text-[13.5px] font-semibold">{e.name}</td>
                <td className="px-4 py-3 text-[13px] text-muted">{e.state}</td>
                <td className="tabular-nums px-4 py-3 text-[13px] text-muted">${e.gross.toLocaleString()}</td>
                <td className="tabular-nums px-4 py-3 text-[13px] text-muted">${e.taxes.toLocaleString()}</td>
                <td className="tabular-nums px-4 py-3 text-[13.5px] font-semibold">${e.net.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Pill tone="success" className="ml-0">
                    Ready
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showAiCard && <AiSuggestCard />}
    </>
  );
}

function ReviewScreen({
  canPreview,
  totalNet,
  onApprove,
  onBack,
  onGoOverview,
}: {
  canPreview: boolean;
  totalNet: number;
  onApprove: () => void;
  onBack: () => void;
  onGoOverview: () => void;
}) {
  if (!canPreview) {
    return (
      <Card className="border-dashed p-6 text-[13.5px] text-muted">
        Nothing to review yet — resolve the blocker on Overview first.
        <div className="mt-3">
          <Button variant="secondary" size="small" onClick={onGoOverview}>
            Go to Overview
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <p className="mb-1 text-[12.5px] text-muted">Review &middot; Due Fri Oct 30</p>
      <h1 className="mb-5 text-[26px] font-bold tracking-tight">Review payroll</h1>

      <Card className="mb-6 flex overflow-hidden">
        {[
          { n: "87", l: "Employees paid" },
          { n: `$${totalNet.toLocaleString()}`, l: "Employer cost" },
          { n: "1", l: "Changed since last run" },
        ].map((s, i, arr) => (
          <div key={s.l} className={`flex-1 px-5 py-4 ${i !== arr.length - 1 ? "border-r border-border" : ""}`}>
            <div className="tabular-nums text-[21px] font-bold tracking-tight">{s.n}</div>
            <div className="mt-0.5 text-[12px] text-faint">{s.l}</div>
          </div>
        ))}
      </Card>

      <h3 className="mb-2.5 text-[14px] font-bold">Changed since last run</h3>
      <Card className="mb-5 flex items-start justify-between p-4">
        <div>
          <div className="text-[13.5px] font-bold">Dev Patel</div>
          <p className="mt-0.5 max-w-[46ch] text-[12.5px] text-muted">
            State withholding added (CA). Default CA withholding applied. May need adjustment later.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[14px] font-bold text-text">Net pay &minus;$210</div>
          <div className="text-[12px] text-faint">${DEV_NET_BEFORE_FMT} → ${DEV_NET_AFTER_FMT}</div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button onClick={onApprove}>Approve payroll</Button>
        <Button variant="secondary" onClick={onBack}>
          Back to draft
        </Button>
      </div>
    </>
  );
}

function RecordScreen({
  approved,
  viaDefault,
  showAiCard,
  onGoOverview,
}: {
  approved: boolean;
  viaDefault: boolean;
  showAiCard: boolean;
  onGoOverview: () => void;
}) {
  if (!approved) {
    return (
      <Card className="border-dashed p-6 text-[13.5px] text-muted">
        Payroll hasn&rsquo;t been approved yet.
        <div className="mt-3">
          <Button variant="secondary" size="small" onClick={onGoOverview}>
            Go to Overview
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <p className="mb-1 text-[12.5px] text-muted">Record</p>
      <h1 className="mb-5 text-[26px] font-bold tracking-tight">Payroll approved</h1>

      <h3 className="mb-2.5 text-[14px] font-bold">Audit log</h3>
      <Card className="mb-6 overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wider text-faint">
              <th className="px-4 py-2.5 font-semibold">When</th>
              <th className="px-4 py-2.5 font-semibold">Event</th>
              <th className="px-4 py-2.5 font-semibold">By</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Oct 15", "Dev Patel moved WA → CA. Address updated.", "System"],
              ["Oct 20", "CA form requested from Dev Patel. Company registration started.", "Omaid"],
              ["Oct 28", `${viaDefault ? "Default CA withholding approved" : "CA tax form received"} for Dev Patel.`, "Omaid (admin)"],
              ["Oct 28", "Payroll approved. Dev notified by email.", "Omaid"],
            ].map(([when, event, by], i, arr) => (
              <tr key={event} className={i !== arr.length - 1 ? "border-b border-border" : ""}>
                <td className="px-4 py-3 text-[13px] text-muted">{when}</td>
                <td className="px-4 py-3 text-[13px]">{event}</td>
                <td className="px-4 py-3 text-[13px] text-muted">{by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <h3 className="mb-2.5 text-[14px] font-bold">Email to Dev</h3>
      <Card className="mb-6 p-4 text-[12.5px] leading-relaxed">
        <p className="mb-2 text-faint">To: dev.patel@example.com &middot; Subject: Your pay is changing</p>
        <p>
          Hi Dev, since you moved to California, state tax withholding now applies to your pay. Starting this pay period, about $210 per period
          will be withheld, so your net pay drops from ${DEV_NET_BEFORE.toLocaleString()} to ${DEV_NET_AFTER.toLocaleString()}.
        </p>
        <p className="mt-2">
          {viaDefault && "Your California form was replaced by default withholding until he submits it. "}Questions? Reply to this email.
        </p>
      </Card>

      {showAiCard && <AiSuggestCard />}
    </>
  );
}

function AiSuggestCard() {
  const chips = [
    "3 employees are missing W-4 forms. Send reminders?",
    "Check California registration status",
    "Auto-request tax forms when employees move states",
  ];
  return (
    <Card className="border-accent-soft-border bg-accent-soft/40 p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-accent-ink">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M8 2L9.2 6.8L14 8L9.2 9.2L8 14L6.8 9.2L2 8L6.8 6.8L8 2Z" fill="currentColor" />
        </svg>
        Bolto AI suggests
      </div>
      <p className="mb-2.5 text-[12.5px] text-muted">Nothing urgent right now. Here is what else you could work on:</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c}
            disabled
            title="AI chat isn't wired up in this prototype"
            className="rounded-full border border-accent-soft-border bg-surface px-3 py-1.5 text-left text-[12px] font-medium text-accent-ink disabled:cursor-not-allowed"
          >
            {c}
          </button>
        ))}
      </div>
    </Card>
  );
}
