import type { CSSProperties, ReactNode } from "react";
import { cn } from "../lib/cn";
import { thumbColor } from "../lib/thumbColor";

export interface ThumbProps {
  seed?: number;
  src?: string | null;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Thumb({
  seed = 0,
  src,
  alt = "",
  className,
  style,
  children,
}: ThumbProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-line-strong",
        className,
      )}
      style={{
        ...(src ? undefined : { backgroundColor: thumbColor(seed) }),
        ...style,
      }}
    >
      {src && (
        <img src={src} alt={alt} className="size-full object-cover" />
      )}
      {children}
    </div>
  );
}
