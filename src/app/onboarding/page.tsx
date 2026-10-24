"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { STEP_ORDER, firstIncompleteStep, progressCount, remainingMinutes, remainingStepTitles } from "@/lib/onboarding/derive";
import { ProgressBar, StepRow, Banner } from "@/components/onboarding/ui";
import { Button } from "@/components/ui/Button";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { COMPANY, FIRST_PAYDAY } from "@/lib/onboarding/data";

export default function ChecklistPage() {
  const router = useRouter();
  const { state, openHelp, setTourOpen } = useOnboarding();
  const { steps } = state;
  const { done, total } = progressCount(steps);
  const remaining = remainingStepTitles(steps);
  const minutesLeft = remainingMinutes(steps);
  const needsAttentionSteps = STEP_ORDER.filter((id) => steps[id].status === "needs_attention");

  return (
    <div className="flex h-full flex-col">
      <OnboardingHeader />
      <div className="flex-1 overflow-y-auto px-5 pb-3">
        <h1 className="text-[20px] font-bold tracking-tight text-text">Hi Jordan, 6 steps, about 15 minutes</h1>
        <p className="mt-1 text-[12.5px] text-muted">Your progress is saved. You can finish later.</p>

        <div className="mt-4">
          <ProgressBar done={done} total={total} minutesLeft={minutesLeft} />
        </div>

        {needsAttentionSteps.length > 0 && (
          <Banner tone="warning" className="mt-3">
            <span className="font-semibold">
              {needsAttentionSteps.length} item{needsAttentionSteps.length === 1 ? "" : "s"} left to finish:
            </span>{" "}
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

        <div className="mt-4">
          {STEP_ORDER.map((id, i) => (
            <StepRow key={id} stepId={id} index={i + 1} title={steps[id].title} minutes={steps[id].minutes} status={steps[id].status} />
          ))}
        </div>

        <div className="mt-1 rounded-xl bg-accent-soft p-3">
          <div className="text-[12.5px] font-bold text-accent-ink">What happens next</div>
          <p className="mt-1 text-[12px] leading-relaxed text-text">
            After you finish, {COMPANY}&rsquo;s HR team reviews your documents. Your first payday is {FIRST_PAYDAY}.
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setTourOpen(true);
              router.push("/onboarding/home");
            }}
          >
            Take a 1-minute tour
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => openHelp()}>
            Get help
          </Button>
        </div>
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <Button
          className="w-full"
          onClick={() => router.push(done === total ? "/onboarding/review" : `/onboarding/step/${firstIncompleteStep(steps)}`)}
          title={done === total ? undefined : `${remaining.length} steps left: ${remaining.join(", ")}`}
        >
          {done === total ? "Go to review" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
