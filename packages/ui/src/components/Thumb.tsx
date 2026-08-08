import type { CSSProperties, ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * 作品サムネイルのプレースホルダ。
 * 画像URLが来るまでは .pen と同じ暖色パレットで塗り分ける。
 */
const PALETTE = [
  "#e8d9bf",
  "#dcc7a4",
  "#f0e4d0",
  "#cbb491",
  "#e3d2b4",
  "#d4b896",
  "#efe2c9",
  "#c9b28f",
];

export function thumbColor(seed: number) {
  return PALETTE[Math.abs(seed) % PALETTE.length];
}

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
