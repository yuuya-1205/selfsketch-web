import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "../lib/cn";

export interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  caption?: ReactNode;
  tone?: "paper" | "surface" | "ink";
  className?: string;
}

/** 「達成率 86%」のような数値カード */
export function StatCard({
  label,
  value,
  unit,
  caption,
  tone = "paper",
  className,
}: StatCardProps) {
  const dark = tone === "ink";
  return (
    <Card tone={tone} className={cn("flex flex-col gap-1 p-4", className)}>
      <span
        className={cn(
          "text-[11px] font-bold tracking-[1.1px]",
          dark ? "text-nav-icon" : "text-muted",
        )}
      >
        {label}
      </span>
      <span className="flex items-end gap-1">
        <span
          className={cn(
            "text-[28px] leading-none font-bold",
            dark ? "text-paper" : "text-ink",
          )}
        >
          {value}
        </span>
        {unit && (
          <span
            className={cn(
              "text-xs font-semibold",
              dark ? "text-nav-fg" : "text-brown",
            )}
          >
            {unit}
          </span>
        )}
      </span>
      {caption && (
        <span
          className={cn(
            "text-[11px]",
            dark ? "text-nav-label" : "text-muted",
          )}
        >
          {caption}
        </span>
      )}
    </Card>
  );
}
