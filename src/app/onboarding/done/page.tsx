"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { Button } from "@/components/ui/Button";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";

const timeline = [
  { label: "Today", detail: "Forms submitted", tone: "success" },
  { label: "By Nov 2", detail: "HR review", tone: "accent" },
  { label: "Nov 2", detail: "First day", tone: "muted" },
  { label: "Nov 13", detail: "First payday", tone: "muted" },
] as const;

const dotClasses = { success: "bg-success", accent: "bg-accent", muted: "bg-surface-sunken border border-border" } as const;

export default function DonePage() {
  const router = useRouter();
  const { setTourOpen } = useOnboarding();

  return (
    <div className="flex h-full flex-col">
      <OnboardingHeader />
      <div className="flex flex-1 flex-col items-center px-5 pb-2 pt-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-[24px] text-success">✓</div>
      <h1 className="mb-6 text-[20px] font-bold tracking-tight text-text">You&rsquo;re all set, Jordan</h1>

      <div className="mb-8 w-full text-left">
        {timeline.map((t, i) => (
          <div key={t.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotClasses[t.tone]}`} aria-hidden="true" />
              {i !== timeline.length - 1 && <span className="my-0.5 h-8 w-px bg-border" />}
            </div>
            <div className="pb-4">
              <div className="text-[13px] font-semibold text-text">{t.label}</div>
              <div className="text-[12px] text-muted">{t.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex w-full flex-col gap-2">
        <Button className="w-full" onClick={() => router.push("/onboarding/home")}>
          Go to my home
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setTourOpen(true);
            router.push("/onboarding/home");
          }}
        >
          Take the tour
        </Button>
      </div>
      </div>
    </div>
  );
}
