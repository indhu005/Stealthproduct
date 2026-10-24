import { COMPANY } from "@/lib/onboarding/data";

// Persistent app chrome shown from Account setup onward — not on the Welcome
// email screen, which is a mail-client mockup rather than the product itself.
export function OnboardingHeader() {
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-1">
      <div className="flex items-center gap-1.5 text-[14px] font-bold tracking-tight text-text">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-white">b</span>
        bolto
      </div>
      <div className="flex items-center gap-1.5 text-[11.5px] text-muted">
        {COMPANY}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent-ink">
          JR
        </span>
      </div>
    </div>
  );
}
