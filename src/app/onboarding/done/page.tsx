"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { Button } from "@/components/ui/Button";
import { FIRST_PAYDAY, START_DATE } from "@/lib/onboarding/data";

const timeline = [
  { label: "Today", detail: "Forms submitted", done: true },
  { label: "By Nov 2", detail: "HR review", done: false },
  { label: "Nov 2", detail: "First day", done: false },
  { label: "Nov 13", detail: "First payday", done: false },
];

export default function DonePage() {
  const router = useRouter();
  const { setTourOpen } = useOnboarding();

  return (
    <div className="flex h-full flex-col items-center px-5 pb-5 pt-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-[24px] text-success">✓</div>
      <h1 className="mb-1 text-[20px] font-bold tracking-tight text-text">You&rsquo;re all set, Jordan</h1>
      <p className="mb-6 text-[13px] text-muted">
        Your start date is {START_DATE}. Your first payday is {FIRST_PAYDAY}.
      </p>

      <div className="mb-8 w-full text-left">
        {timeline.map((t, i) => (
          <div key={t.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${t.done ? "bg-success text-white" : "border border-border bg-surface-sunken text-faint"}`}>
                {t.done ? "✓" : i + 1}
              </span>
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
  );
}
