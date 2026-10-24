"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EMPLOYEE_EMAIL } from "@/lib/onboarding/data";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/onboarding/ui";

const rules = [
  { id: "len", label: "At least 10 characters", test: (p: string) => p.length >= 10 },
  { id: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "num", label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function AccountSetupPage() {
  const router = useRouter();
  const { setAccountStatus } = useOnboarding();
  const [sso, setSso] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const unmetRules = rules.filter((r) => !r.test(password));
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = unmetRules.length === 0 && confirm.length > 0 && !mismatch;

  function submit() {
    setAttempted(true);
    if (!canSubmit) return;
    setSubmitting(true);
    setNetworkError(false);
    window.setTimeout(() => {
      setSubmitting(false);
      setAccountStatus("active");
      router.push("/onboarding");
    }, 500);
  }

  if (sso) {
    return (
      <div className="flex h-full flex-col justify-center px-5 pb-10">
        <h1 className="mb-1 text-[20px] font-bold tracking-tight text-text">Create your account</h1>
        <p className="mb-5 text-[13px] text-muted">Acme Studio uses single sign-on.</p>
        <Button onClick={() => { setAccountStatus("active"); router.push("/onboarding"); }}>Continue with your company login</Button>
        <button onClick={() => setSso(false)} className="mt-3 text-[12px] text-faint underline">
          Demo: show standard account form instead
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-5 pb-5 pt-2">
      <h1 className="mb-1 text-[20px] font-bold tracking-tight text-text">Create your account</h1>
      <p className="mb-4 text-[13px] text-muted">This is how you&rsquo;ll sign in from now on.</p>

      {networkError && (
        <Banner tone="critical" className="mb-3">
          Something went wrong creating your account.{" "}
          <button onClick={submit} className="font-semibold underline">
            Retry
          </button>
        </Banner>
      )}

      <div className="mb-4">
        <label className="mb-1 block text-[13px] font-semibold text-text">Email</label>
        <input
          readOnly
          value={EMPLOYEE_EMAIL}
          className="w-full rounded-lg border border-border bg-surface-sunken px-3 py-2.5 text-[14px] text-muted"
        />
      </div>

      <div className="mb-1">
        <label className="mb-1 block text-[13px] font-semibold text-text">Password</label>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 focus-within:ring-2 focus-within:ring-accent">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-text focus:outline-none"
            aria-describedby="password-rules"
          />
          <button type="button" onClick={() => setShowPw((s) => !s)} className="shrink-0 text-[11.5px] font-semibold text-accent-ink">
            {showPw ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <ul id="password-rules" className="mb-4 mt-1.5 flex flex-col gap-1">
        {rules.map((r) => {
          const met = r.test(password);
          return (
            <li key={r.id} className={`flex items-center gap-1.5 text-[11.5px] ${met ? "text-success" : "text-faint"}`}>
              <span aria-hidden="true">{met ? "✓" : "○"}</span>
              {r.label}
            </li>
          );
        })}
      </ul>

      <div className="mb-1">
        <label className="mb-1 block text-[13px] font-semibold text-text">Confirm password</label>
        <input
          type={showPw ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch || undefined}
          className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-[14px] text-text focus:outline-none focus:ring-2 focus:ring-accent ${
            mismatch ? "border-critical" : "border-border"
          }`}
        />
      </div>
      {mismatch && (
        <p role="alert" aria-live="polite" className="mb-4 text-[12px] font-medium text-critical">
          Passwords don&rsquo;t match.
        </p>
      )}
      {!mismatch && <div className="mb-4" />}

      <p className="mb-4 text-[11.5px] leading-relaxed text-faint">
        By continuing you agree to the{" "}
        <span className="font-semibold text-accent-ink underline">Terms</span> and{" "}
        <span className="font-semibold text-accent-ink underline">Privacy Policy</span>.
      </p>

      <Button onClick={submit} disabled={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </Button>
      {attempted && !canSubmit && !submitting && (
        <p className="mt-2 text-[12px] text-faint">Finish the password requirements and confirm it matches.</p>
      )}

      <div className="mt-auto flex flex-col gap-1.5 pt-4 text-center">
        <button onClick={() => setSso(true)} className="text-[11.5px] text-faint underline">
          Demo: show SSO variant
        </button>
        <button onClick={() => setNetworkError(true)} className="text-[11.5px] text-faint underline">
          Demo: show network error
        </button>
      </div>
    </div>
  );
}
