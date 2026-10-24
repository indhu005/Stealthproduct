"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { STEP_ORDER, progressCount, remainingStepTitles } from "@/lib/onboarding/derive";
import { generateReviewSuggestions } from "@/lib/onboarding/ai";
import { Button } from "@/components/ui/Button";
import { SuggestionCard } from "@/components/onboarding/ui";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import type { StepId } from "@/lib/onboarding/types";

const editTarget: Record<string, StepId> = {
  emergencyContactPhone: "personal",
  zip: "personal",
  benefits: "benefits",
};

export default function ReviewPage() {
  const router = useRouter();
  const { state, dismissSuggestion } = useOnboarding();
  const { done, total } = progressCount(state.steps);
  const remaining = remainingStepTitles(state.steps);
  const canSubmit = done === total;

  const suggestions = generateReviewSuggestions(state.forms).filter((s) => !state.dismissedSuggestions.includes(s.id));

  return (
    <div className="flex h-full flex-col">
      <OnboardingHeader />
      <div className="flex-1 overflow-y-auto px-5 pb-2">
        <button onClick={() => router.push("/onboarding")} className="mb-3 text-[12.5px] font-semibold text-accent-ink hover:underline">
          &lsaquo; Back to checklist
        </button>

        <h1 className="mb-3 text-[20px] font-bold tracking-tight text-text">Let&rsquo;s double-check</h1>
        <div className="mb-4 rounded-xl bg-accent-soft p-3 text-[12.5px] leading-relaxed text-text">
          <span className="font-bold text-accent-ink">Suggestions are optional.</span> Nothing changes unless you choose it.
        </div>

        {!canSubmit && (
          <div className="mb-4 rounded-xl border border-warning/30 bg-warning-soft p-3 text-[12.5px] text-warning">
            {remaining.length} step{remaining.length === 1 ? "" : "s"} left: {remaining.join(", ")}.
          </div>
        )}

        {suggestions.length === 0 ? (
          <p className="mb-4 text-[12.5px] text-faint">Nothing to flag right now.</p>
        ) : (
          <div className="mb-4 flex flex-col gap-2">
            {suggestions.map((s) => (
              <SuggestionCard
                key={s.id}
                text={s.text}
                positive={s.kind === "consistency_check" && s.id === "zip-state-match"}
                onUseThis={s.actions.includes("use_this") ? () => dismissSuggestion(s.id) : undefined}
                onEdit={
                  s.actions.includes("edit")
                    ? () => router.push(`/onboarding/step/${editTarget[s.fieldId] ?? "personal"}`)
                    : undefined
                }
                onDismiss={() => dismissSuggestion(s.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <Button
          className="w-full"
          disabled={!canSubmit}
          title={canSubmit ? undefined : `${remaining.length} steps left: ${remaining.join(", ")}`}
          onClick={() => router.push("/onboarding/done")}
        >
          Submit for review
        </Button>
        {!canSubmit && (
          <p className="mt-2 text-center text-[11.5px] text-faint">
            {remaining.length} step{remaining.length === 1 ? "" : "s"} left: {remaining.join(", ")}.
          </p>
        )}
        {!canSubmit && (
          <button
            onClick={() => router.push(`/onboarding/step/${STEP_ORDER.find((id) => state.steps[id].status !== "done")}`)}
            className="mt-1 w-full text-center text-[12px] font-semibold text-accent-ink hover:underline"
          >
            Finish remaining steps
          </button>
        )}
      </div>
    </div>
  );
}
