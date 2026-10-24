import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "warning" | "critical" | "secondary";
type Size = "default" | "small";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-[0_8px_20px_-6px_rgba(47,98,245,0.45)] hover:bg-accent-hover",
  secondary: "border border-border bg-surface text-text hover:bg-surface-sunken",
  ghost: "bg-transparent text-muted hover:text-critical",
  warning: "bg-warning-soft text-warning hover:brightness-95",
  critical: "bg-critical text-white hover:brightness-95",
};

const sizeClasses: Record<Size, string> = {
  default: "px-4 py-2.5 text-[13px]",
  small: "px-3.5 py-1.5 text-[12.5px]",
};

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={`appearance-none rounded-xl font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
