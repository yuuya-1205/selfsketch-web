import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** スクリーンリーダー用のラベル。必須 */
  label: string;
  children: ReactNode;
  size?: number;
}

export function IconButton({
  label,
  children,
  size = 34,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid shrink-0 place-items-center rounded-[10px] border border-line-strong text-ink",
        "transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:outline-none",
        className,
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      {children}
    </button>
  );
}
