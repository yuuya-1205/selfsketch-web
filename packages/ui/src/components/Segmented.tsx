import { cn } from "../lib/cn";

export interface SegmentedProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange?: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
}

/** 期間切り替えなどに使うピル型セグメント（.pen の tabs ノード相当） */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: SegmentedProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 gap-0.5 rounded-control border border-line-strong bg-surface p-[3px]",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={o === value}
          onClick={() => onChange?.(o)}
          className={cn(
            "rounded-[9px] font-semibold whitespace-nowrap transition-colors",
            size === "sm" ? "px-3 py-1.5 text-[11px]" : "px-4 py-[7px] text-xs",
            o === value ? "bg-ink text-paper" : "text-brown hover:bg-line/50",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
