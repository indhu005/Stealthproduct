"use client";

import { useEffect, useRef, useState } from "react";

// Wraps the app in a laptop bezel, centered on the page — matching how the
// source Figma Make file presents the Bolto concept on a canvas rather than
// edge-to-edge. The `transform` on the screen area isn't just visual: per the
// CSS spec, it also makes any `position: fixed` descendant (SidePanel,
// Dialog) contained within this box instead of the true browser viewport —
// which is what keeps popups anchored to the app frame instead of sliding in
// from the real screen edge.
//
// Below tablet widths, the laptop and phone stack vertically instead of
// shrinking together side by side — keeps both legible instead of scaling
// the whole composition down to fit a cramped row.
const STACK_BREAKPOINT = 1180;

export function LaptopFrame({
  children,
  aside,
}: {
  children: React.ReactNode;
  // Rendered below the laptop bezel on tablet-width screens, beside it on
  // wider ones.
  aside?: React.ReactNode;
}) {
  const laptopRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  // CSS `transform: scale()` only changes rendering, not the element's
  // layout footprint — without this, the flex container still reserves the
  // full unscaled size, leaving a large gap below the visually-shrunk
  // laptop. Measuring the natural size and sizing a wrapper to
  // natural * scale keeps the reserved space matching what's actually drawn.
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [stacked, setStacked] = useState(false);

  useEffect(() => {
    const laptop = laptopRef.current;
    if (!laptop) return;

    const update = () => {
      const padding = 64;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const shouldStack = vw < STACK_BREAKPOINT;
      setStacked(shouldStack);

      const naturalWidth = laptop.offsetWidth;
      const naturalHeight = laptop.offsetHeight;
      setNaturalSize({ w: naturalWidth, h: naturalHeight });

      const next = shouldStack
        ? // Stacked: scale the laptop to fit the available width only — the
          // phone sits below it at its own size, and the page scrolls
          // vertically if the pair doesn't fit the viewport height.
          Math.min(1, (vw - padding) / naturalWidth)
        : // Side by side: scale to fit both width (reserving room for the
          // phone + gap) and height.
          Math.min(1, (vw - padding - 300) / naturalWidth, (vh - padding) / naturalHeight);

      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className={`flex min-h-screen w-full gap-10 bg-[#eceef1] p-8 ${
        stacked ? "flex-col items-center overflow-y-auto py-12" : "items-center justify-center overflow-hidden"
      }`}
    >
      <div
        style={naturalSize ? { width: naturalSize.w * scale, height: naturalSize.h * scale } : undefined}
      >
        <div
          ref={laptopRef}
          className="flex w-max flex-col items-center"
          style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          <div className="rounded-[20px] bg-[#1a1b1f] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
            <div
              className="relative h-[800px] w-[1280px] overflow-hidden rounded-[8px] bg-bg"
              style={{ transform: "translateZ(0)" }}
            >
              <div className="h-full overflow-y-auto">{children}</div>
            </div>
          </div>
          <div className="h-3 w-[92%] rounded-b-[10px] bg-gradient-to-b from-[#d4d5d9] to-[#c3c4c9]" />
          <div className="h-2 w-[36%] rounded-b-[6px] bg-[#b4b5ba]" />
        </div>
      </div>
      {aside}
    </div>
  );
}
