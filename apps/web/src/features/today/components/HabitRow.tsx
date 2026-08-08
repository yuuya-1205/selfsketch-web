import { Ellipsis } from "lucide-react";
import { Badge, CheckCircle, cn } from "@selfsketch/ui";
import type { Habit } from "@/lib/api/types";

export interface HabitRowProps {
  habit: Habit;
  onToggle: (done: boolean) => void;
}

export function HabitRow({ habit, onToggle }: HabitRowProps) {
  const { title, meta, done, slot } = habit;

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3.5 rounded-row px-4 py-3.5 transition-colors",
        done
          ? "border border-line-strong bg-surface"
          : "border-[1.5px] border-ink bg-paper",
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`${title} を${done ? "未完了に戻す" : "完了にする"}`}
        onClick={() => onToggle(!done)}
        className="rounded-full focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:outline-none"
      >
        <CheckCircle checked={done} />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-ink">{title}</span>
        <span
          className={cn("text-[11px]", done ? "text-muted" : "text-brown")}
        >
          {meta}
        </span>
      </div>

      <Badge tone="track" className="hidden px-2.5 py-1 text-[10px] sm:inline-flex">
        {slot}
      </Badge>

      <button
        type="button"
        aria-label={`${title} のメニュー`}
        className="shrink-0 rounded p-0.5 text-muted transition-colors hover:text-ink"
      >
        <Ellipsis size={16} />
      </button>
    </div>
  );
}
