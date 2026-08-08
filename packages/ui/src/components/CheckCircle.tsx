import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface CheckCircleProps {
  checked: boolean;
  size?: number;
  className?: string;
}

/** 習慣リスト・チェックリストで使う丸チェック（.pen の cb ノード相当） */
export function CheckCircle({
  checked,
  size = 22,
  className,
}: CheckCircleProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full border-[1.5px] border-ink transition-colors",
        checked ? "bg-ink text-paper" : "bg-paper text-transparent",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Check size={Math.round(size * 0.5)} strokeWidth={3} />
    </span>
  );
}
