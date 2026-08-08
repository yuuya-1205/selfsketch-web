import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

type Variant = "primary" | "outline" | "ghost" | "danger" | "inverse";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink/90",
  outline: "border border-line-strong text-brown bg-paper hover:bg-surface",
  ghost: "text-brown hover:bg-surface",
  danger: "border border-danger text-danger bg-paper hover:bg-danger-bg",
  inverse: "bg-paper text-ink hover:bg-paper/90",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 gap-1.5 rounded-[9px] px-3 text-[11px] font-semibold",
  md: "h-10 gap-2 rounded-control px-4 text-[13px] font-bold",
  lg: "h-12 gap-2 rounded-[12px] px-6 text-sm font-bold",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** 先頭に置くアイコン。lucide-react の要素を渡す */
  icon?: ReactNode;
  block?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  block,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANT[variant],
        SIZE[size],
        block && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
