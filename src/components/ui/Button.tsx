import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "warning";
type Size = "default" | "small";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-ink",
  ghost: "bg-transparent text-muted hover:text-critical",
  warning: "bg-warning-soft text-warning hover:brightness-95",
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
      className={`appearance-none rounded-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
