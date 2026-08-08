import { cn } from "../lib/cn";

export interface ProgressProps {
  /** 0–1 */
  value: number;
  className?: string;
  /** 溝と塗りの色を反転（濃色カードの上で使う） */
  inverse?: boolean;
  height?: number;
  label?: string;
}

export function Progress({
  value,
  className,
  inverse,
  height = 6,
  label,
}: ProgressProps) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "w-full overflow-hidden rounded-full",
        inverse ? "bg-nav-active" : "bg-track",
        className,
      )}
      style={{ height }}
    >
      <div
        className={cn("h-full rounded-full", inverse ? "bg-line" : "bg-brown")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
