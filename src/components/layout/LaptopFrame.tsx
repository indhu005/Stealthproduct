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
// The canvas is a fixed 1280x800 design — on narrower screens (tablets in
// particular) it's scaled down to fit via a measured CSS transform rather
// than reflowing, so nothing inside the fixed-width app layout ever gets
// clipped or forces its own scrollbar.
export function LaptopFrame({
  children,
  aside,
}: {
  children: React.ReactNode;
  // Rendered as a flex sibling of the laptop bezel — centered and scaled
  // together with it.
  aside?: React.ReactNode;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;

    const updateScale = () => {
      const padding = 64;
      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - padding;
      // scrollWidth/Height reflect the group's natural (unscaled) layout
      // size — CSS `transform: scale()` doesn't affect layout box metrics.
      const naturalWidth = el.scrollWidth;
      const naturalHeight = el.scrollHeight;
      const next = Math.min(1, availableWidth / naturalWidth, availableHeight / naturalHeight);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#eceef1] p-8">
      <div
        ref={groupRef}
        className="flex items-center gap-10"
        style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
      >
        <div className="flex flex-col items-center">
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
        {aside}
      </div>
    </div>
  );
}
