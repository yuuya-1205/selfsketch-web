import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

type Tone = "neutral" | "solid" | "track" | "ok" | "warn" | "danger";

const TONE: Record<Tone, string> = {
  neutral: "bg-surface border border-line-strong text-brown",
  solid: "bg-ink text-paper",
  track: "bg-track text-brown",
  ok: "bg-ok-bg text-ok",
  warn: "bg-warn-bg text-warn",
  danger: "bg-danger-bg text-danger",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        TONE[tone],
        className,
      )}
      {...props}
    />
  );
}
