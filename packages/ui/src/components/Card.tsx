import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

type Tone = "paper" | "surface" | "ink" | "outline";

const TONE: Record<Tone, string> = {
  paper: "bg-paper border border-line-strong",
  surface: "bg-surface border border-line-strong",
  outline: "bg-paper border-[1.5px] border-ink",
  ink: "bg-nav text-paper",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function Card({ tone = "paper", className, ...props }: CardProps) {
  return (
    <div
      className={cn("box-border rounded-card", TONE[tone], className)}
      {...props}
    />
  );
}

/** カード内の小見出し。11px / 700 / letter-spacing 1.3 の共通ラベル */
export function CardLabel({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "text-[11px] font-bold tracking-[1.3px] text-muted",
        className,
      )}
      {...props}
    />
  );
}
