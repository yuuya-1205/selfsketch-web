import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * 読み込み中のプレースホルダ1枚。
 * 高さ・幅は使う側が className で決める（`h-16 w-full` など）。
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block rounded-card bg-surface", className)}
    />
  );
}

/**
 * Skeleton をまとめる箱。点滅アニメーションと読み上げはここが持つので、
 * 個々の Skeleton には付けない。
 */
export function SkeletonGroup({
  label = "読み込み中",
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("flex w-full animate-pulse flex-col gap-3", className)}
    >
      {children}
    </div>
  );
}
