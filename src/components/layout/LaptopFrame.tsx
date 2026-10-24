// Wraps the app in a laptop bezel, centered on the page — matching how the
// source Figma Make file presents the Bolto concept on a canvas rather than
// edge-to-edge. The `transform` on the screen area isn't just visual: per the
// CSS spec, it also makes any `position: fixed` descendant (SidePanel,
// Dialog) contained within this box instead of the true browser viewport —
// which is what keeps popups anchored to the app frame instead of sliding in
// from the real screen edge.
export function LaptopFrame({
  children,
  aside,
}: {
  children: React.ReactNode;
  // Rendered as a flex sibling of the laptop bezel — centered together with
  // it, and reflows onto its own row (still centered) when the viewport is
  // too narrow to fit both side by side, instead of being pinned to a
  // viewport-relative offset that can run off a normal laptop screen.
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-wrap items-center justify-center gap-10 overflow-x-auto bg-[#eceef1] p-8">
      <div className="flex shrink-0 flex-col items-center">
        <div className="rounded-[20px] bg-[#1a1b1f] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
          <div
            className="relative h-[800px] max-h-[80vh] w-[1280px] min-w-[1000px] max-w-[90vw] overflow-hidden rounded-[8px] bg-bg"
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
  );
}
