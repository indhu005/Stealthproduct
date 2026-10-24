"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { STEP_ORDER, firstIncompleteStep, progressCount, remainingStepTitles } from "@/lib/onboarding/derive";
import { ProgressBar, StepRow, Banner } from "@/components/onboarding/ui";
import { Button } from "@/components/ui/Button";
import { COMPANY, FIRST_PAYDAY } from "@/lib/onboarding/data";

export default function ChecklistPage() {
  const router = useRouter();
  const { state, openHelp, setTourOpen } = useOnboarding();
  const { steps } = state;
  const { done, total } = progressCount(steps);
  const remaining = remainingStepTitles(steps);
  const needsAttentionSteps = STEP_ORDER.filter((id) => steps[id].status === "needs_attention");

  return (
    <div className="flex h-full flex-col px-5 pb-5 pt-2">
      <h1 className="text-[20px] font-bold tracking-tight text-text">Hi Jordan, 6 steps, about 15 minutes</h1>
      <p className="mt-1 text-[12.5px] text-muted">Your progress is saved. You can finish later.</p>

      <div className="mt-4">
        <ProgressBar done={done} total={total} />
      </div>

      {needsAttentionSteps.length > 0 && (
        <Banner tone="warning" className="mt-3">
          <span className="font-semibold">{needsAttentionSteps.length} item{needsAttentionSteps.length === 1 ? "" : "s"} left to finish:</span>{" "}
          {needsAttentionSteps.map((id, i) => (
            <span key={id}>
              {i > 0 && ", "}
              <Link href={`/onboarding/step/${id}`} className="underline">
                {steps[id].title}
              </Link>
            </span>
          ))}
        </Banner>
      )}

      <div className="mt-4 rounded-2xl border border-border bg-surface px-3">
        {STEP_ORDER.map((id) => (
          <StepRow key={id} stepId={id} title={steps[id].title} minutes={steps[id].minutes} status={steps[id].status} />
        ))}
      </div>

      <div className="mt-4">
        <Button
          className="w-full"
          onClick={() => router.push(`/onboarding/step/${firstIncompleteStep(steps)}`)}
          disabled={done === total}
          title={done === total ? undefined : `${remaining.length} steps left: ${remaining.join(", ")}`}
        >
          {done === total ? "Go to review" : "Continue"}
        </Button>
        {done === total && (
          <Button className="mt-2 w-full" variant="secondary" onClick={() => router.push("/onboarding/review")}>
            Go to review
          </Button>
        )}
        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setTourOpen(true);
              router.push("/onboarding/home");
            }}
            className="text-[12px] font-semibold text-accent-ink hover:underline"
          >
            Take a 1-minute tour
          </button>
          <button onClick={() => openHelp()} className="text-[12px] font-semibold text-accent-ink hover:underline">
            Get help
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-border p-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-faint">What happens next</div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          After you finish, {COMPANY}&rsquo;s HR team reviews your documents. Your first payday is {FIRST_PAYDAY}.
        </p>
      </div>
    </div>
  );
}
