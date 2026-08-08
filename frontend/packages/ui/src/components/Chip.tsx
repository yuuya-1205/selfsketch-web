import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** 一覧の絞り込みチップ */
export function Chip({ active, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line-strong bg-paper text-brown hover:bg-surface",
        className,
      )}
      {...props}
    />
  );
}
