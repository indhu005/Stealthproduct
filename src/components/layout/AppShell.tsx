import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({
  active,
  children,
}: {
  active?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full bg-surface">
      <Sidebar active={active} />
      <div className="min-w-0 flex-1 bg-bg p-7.5">
        <div className="mx-auto max-w-[980px]">{children}</div>
      </div>
    </div>
  );
}
