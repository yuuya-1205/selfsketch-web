import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface SectionHeadingProps {
  children: ReactNode;
  /** 右端に置く補助要素（「すべて表示」など） */
  action?: ReactNode;
  className?: string;
}

/** 「今日の習慣 ————— すべて表示」の見出し行 */
export function SectionHeading({
  children,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <h2 className="text-[13px] font-bold tracking-[0.8px] text-ink">
        {children}
      </h2>
      <span className="h-px flex-1" />
      {action}
    </div>
  );
}
