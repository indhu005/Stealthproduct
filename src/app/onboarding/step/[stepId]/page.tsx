"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { STEP_ORDER, validateStep } from "@/lib/onboarding/derive";
import type { StepId } from "@/lib/onboarding/types";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/onboarding/ui";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { PersonalStep } from "@/components/onboarding/steps/PersonalStep";
import { TaxStep } from "@/components/onboarding/steps/TaxStep";
import { DepositStep } from "@/components/onboarding/steps/DepositStep";
import { EligibilityStep } from "@/components/onboarding/steps/EligibilityStep";
import { BenefitsStep } from "@/components/onboarding/steps/BenefitsStep";
import { PoliciesStep } from "@/components/onboarding/steps/PoliciesStep";

const intro: Record<StepId, string> = {
  personal: "Let's start with the basics.",
  tax: "A few federal W-4 questions so your paycheck holds back the right amount.",
  deposit: "Where should we send your pay? Sample values below are fake.",
  eligibility: "Confirms you're authorized to work in the US.",
  benefits: "Choose your coverage, or decide later.",
  policies: "A few documents to review and acknowledge.",
};

export default function StepPage() {
  const params = useParams<{ stepId: string }>();
  const router = useRouter();
  const { state, updateField, attemptStep, openHelp } = useOnboarding();

  const stepId = params.stepId as StepId;
  if (!STEP_ORDER.includes(stepId)) notFound();

  const index = STEP_ORDER.indexOf(stepId);
  const step = state.steps[stepId];
  // Only surface blocking-field errors after a "Save and continue" attempt —
  // an untouched or in-progress step shouldn't flash errors before the
  // person has had a chance to fill it in (spec's needs_attention rule).
  const attempted = (state.forms[stepId] as { attempted: boolean }).attempted;
  const blockingCount = step.issues.filter((i) => i.severity === "blocking").length;
  const issues = attempted ? step.issues : step.issues.filter((i) => i.severity === "suggestion");

  function goNext() {
    attemptStep(stepId);
    const hasBlocking = validateStep(stepId, state.forms).some((i) => i.severity === "blocking");
    if (hasBlocking) return;
    const nextId = STEP_ORDER[index + 1];
    router.push(nextId ? `/onboarding/step/${nextId}` : "/onboarding/review");
  }

  function goBack() {
    const prevId = STEP_ORDER[index - 1];
    router.push(prevId ? `/onboarding/step/${prevId}` : "/onboarding");
  }

  return (
    <div className="flex h-full flex-col">
      <OnboardingHeader />
      <div className="flex-1 overflow-y-auto px-5 pb-2">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={goBack} className="text-[12.5px] font-semibold text-accent-ink hover:underline">
            &lsaquo; Back
          </button>
          <span className="text-[11.5px] text-faint">
            Step {index + 1} of {STEP_ORDER.length} {state.savedAt && "· Saved just now"}
          </span>
        </div>
        <h1 className="mb-1 text-[19px] font-bold tracking-tight text-text">{step.title}</h1>
        <p className="mb-4 text-[13px] text-muted">{intro[stepId]}</p>

        {attempted && blockingCount > 0 && (
          <Banner tone="warning" className="mb-4">
            <span className="font-semibold">
              ! Fix {blockingCount} item{blockingCount === 1 ? "" : "s"} to continue.
            </span>
          </Banner>
        )}

        {stepId === "personal" && (
          <PersonalStep
            fields={state.forms.personal}
            issues={issues}
            onChange={(patch) => updateField("personal", patch)}
            onNotSure={(fieldId) => openHelp({ stepId, fieldId })}
          />
        )}
        {stepId === "tax" && (
          <TaxStep
            fields={state.forms.tax}
            issues={issues}
            onChange={(patch) => updateField("tax", patch)}
            onNotSure={(fieldId) => openHelp({ stepId, fieldId })}
          />
        )}
        {stepId === "deposit" && (
          <DepositStep
            fields={state.forms.deposit}
            issues={issues}
            onChange={(patch) => updateField("deposit", patch)}
            onNotSure={(fieldId) => openHelp({ stepId, fieldId })}
          />
        )}
        {stepId === "eligibility" && (
          <EligibilityStep
            fields={state.forms.eligibility}
            issues={issues}
            onChange={(patch) => updateField("eligibility", patch)}
            onHelp={() => openHelp({ stepId })}
          />
        )}
        {stepId === "benefits" && (
          <BenefitsStep fields={state.forms.benefits} issues={issues} onChange={(patch) => updateField("benefits", patch)} />
        )}
        {stepId === "policies" && (
          <PoliciesStep fields={state.forms.policies} issues={issues} onChange={(patch) => updateField("policies", patch)} />
        )}
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <Button onClick={goNext} className="w-full">
          Save and continue
        </Button>
        <button
          onClick={() => router.push("/onboarding")}
          className="mt-2 w-full text-center text-[12px] font-semibold text-accent-ink hover:underline"
        >
          Save and finish later
        </button>
      </div>
    </div>
  );
}
