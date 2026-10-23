import Link from "next/link";
import { NumberBadge } from "@/components/ui/Badge";

function GroupLabel({ children, badge }: { children: React.ReactNode; badge?: number }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 pt-3.5 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-faint first:pt-0">
      {children}
      {badge !== undefined && <NumberBadge n={badge} />}
    </div>
  );
}

function NavItem({
  href,
  icon,
  active = false,
  disabled = false,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const classes = `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium ${
    active
      ? "bg-accent-soft font-semibold text-accent-ink [&_svg]:opacity-100"
      : "text-muted [&_svg]:opacity-75"
  } ${disabled ? "cursor-default opacity-40" : "hover:bg-surface"}`;

  if (disabled) {
    return (
      <div className={classes}>
        {icon}
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={classes}>
      {icon}
      {children}
    </Link>
  );
}

const icons = {
  grid: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" />
    </svg>
  ),
  tasks: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2.5" y="3" width="11" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 6.5H13.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  people: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 13.5C2.5 10.5 5 9 8 9C11 9 13.5 10.5 13.5 13.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  timeoff: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 6.5H13.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  payroll: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path
        d="M8 2V14M11.5 4.5C11.5 3.4 10 2.5 8 2.5C6 2.5 4.5 3.4 4.5 4.6C4.5 7 11.5 6 11.5 8.9C11.5 10.3 10 11.3 8 11.3C6 11.3 4.5 10.3 4.5 9.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  documents: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <rect x="3" y="2" width="10" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 5.5H10.5M5.5 8H10.5M5.5 10.5H8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 2.5V4M8 12V13.5M13.5 8H12M4 8H2.5M11.8 4.2L10.7 5.3M5.3 10.7L4.2 11.8M11.8 11.8L10.7 10.7M5.3 5.3L4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export function Sidebar({ active }: { active?: string }) {
  return (
    <div className="flex w-[232px] shrink-0 flex-col gap-1 border-r border-border bg-surface-sunken p-3.5">
      <div className="flex items-center gap-1.5 px-2 pb-4 pt-1 text-base font-bold tracking-tight">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M9 1L2.5 9.5H7.5L6.5 15L13.5 6H8.5L9 1Z" fill="var(--color-accent)" />
        </svg>
        bolto
      </div>

      <div className="relative mb-3.5 flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-[12.5px] text-faint">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span className="flex-1">Search or ask AI</span>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-accent">
          <path d="M8 2L9.2 6.8L14 8L9.2 9.2L8 14L6.8 9.2L2 8L6.8 6.8L8 2Z" fill="currentColor" />
        </svg>
        <span className="shrink-0 rounded border border-border bg-surface-sunken px-1 font-mono text-[10px] text-faint">
          ⌘K
        </span>
      </div>

      <GroupLabel>Workspace</GroupLabel>
      <NavItem href="/" icon={icons.grid} active={active === "overview"}>
        Overview
      </NavItem>
      <NavItem href="/" icon={icons.tasks} disabled>
        Tasks
      </NavItem>
      <NavItem href="/" icon={icons.calendar} disabled>
        Calendar
      </NavItem>

      <GroupLabel badge={3}>People</GroupLabel>
      <NavItem href="/" icon={icons.people} disabled>
        Directory
      </NavItem>
      <NavItem href="/" icon={icons.timeoff} disabled>
        Time off
      </NavItem>
      <NavItem href="/" icon={icons.payroll} disabled>
        Payroll
      </NavItem>

      <GroupLabel>Organization</GroupLabel>
      <NavItem href="/" icon={icons.documents} disabled>
        Documents
      </NavItem>
      <NavItem href="/" icon={icons.settings} disabled>
        Settings
      </NavItem>

      <div className="mt-auto flex items-center gap-2.5 border-t border-border p-2.5">
        <div className="h-6.5 w-6.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-accent-ink" />
        <div>
          <div className="text-[12.5px] font-semibold">Omaid Wakily</div>
          <div className="text-[11px] text-faint">Admin</div>
        </div>
      </div>
    </div>
  );
}
