import { ThemeToggle } from "@/components/ThemeToggle";

export function Topbar({ title }: { title: string }) {
  return (
    <div className="mb-5.5 flex items-center justify-between">
      <h2 className="text-[19px] font-bold tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">
        <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full border border-border text-muted">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L9.2 6.8L14 8L9.2 9.2L8 14L6.8 9.2L2 8L6.8 6.8L8 2Z" fill="currentColor" />
          </svg>
        </div>
        <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full border border-border text-[12px] text-muted">
          ?
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
