import { cn } from "../lib/cn";

export interface AvatarProps {
  /** 表示する頭文字 */
  initial: string;
  size?: number;
  className?: string;
}

export function Avatar({ initial, size = 32, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-line font-bold text-ink",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initial}
    </span>
  );
}
