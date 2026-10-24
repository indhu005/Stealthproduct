import { Suspense } from "react";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { HelpHub } from "@/components/onboarding/HelpHub";
import { OnboardingTour } from "@/components/onboarding/Tour";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <PhoneFrame>
        {/* useParams/usePathname in the step page and Tour are only known at
            request time — Suspense lets the rest of the shell still prerender. */}
        <Suspense fallback={null}>
          {children}
          <HelpHub />
          <OnboardingTour />
        </Suspense>
      </PhoneFrame>
    </OnboardingProvider>
  );
}
