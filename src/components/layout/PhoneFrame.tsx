"use client";

import { useEffect, useRef, useState } from "react";

// The onboarding flow is explicitly phone-first per the spec ("on a phone, with
// help available at every step") — unlike the admin Payroll/Time off flows,
// which live in LaptopFrame. Using a distinct device chrome for an
// employee-facing self-serve flow vs. an admin dashboard is a deliberate
// choice, not just decoration.
const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const padding = 64;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const next = Math.min(1, (vw - padding) / PHONE_WIDTH, (vh - padding) / (PHONE_HEIGHT + 24));
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#eceef1] p-8">
      <div style={{ width: PHONE_WIDTH * scale, height: (PHONE_HEIGHT + 24) * scale }}>
        <div ref={wrapRef} className="flex w-max flex-col items-center" style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <div className="rounded-[46px] bg-[#1a1b1f] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
            <div
              className="relative overflow-hidden rounded-[36px] bg-bg"
              style={{ width: PHONE_WIDTH - 20, height: PHONE_HEIGHT - 20, transform: "translateZ(0)" }}
            >
              <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[13px] font-semibold text-text">
                <span>9:41</span>
                <span className="absolute left-1/2 top-2 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-[#1a1b1f]" />
                <span>5G 100%</span>
              </div>
              <div className="h-[calc(100%-32px)] overflow-y-auto pb-6">{children}</div>
            </div>
          </div>
          <div className="mt-2 h-1 w-[120px] rounded-full bg-[#c3c4c9]" />
        </div>
      </div>
    </div>
  );
}
