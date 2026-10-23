import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({
  active,
  children,
}: {
  active?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full overflow-x-auto bg-surface">
      <div className="flex min-w-[960px] flex-1">
        <Sidebar active={active} />
        <div className="min-w-0 flex-1 bg-bg p-7.5">{children}</div>
      </div>
    </div>
  );
}
