import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { thumbColor } from "../lib/thumbColor";

export interface ThumbProps {
  /** 画像が無いときの下地の色を決める種 */
  seed?: number;
  /** 作品の画像。まだ無い / 読み込めないときは下地の色だけ出す */
  src?: string | null;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 作品のサムネイル。
 *
 * 画像 URL が来ればそれを出し、無いときと**読み込みに失敗したとき**は
 * seed から決まる暖色の下地にする。壊れた URL で空の枠が残らないようにするため。
 */
export function Thumb({
  seed = 0,
  src,
  alt = "",
  className,
  style,
  children,
}: ThumbProps) {
  // 失敗した URL そのものを覚える。src が差し替わったら自然に効かなくなる
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-line-strong",
        className,
      )}
      style={{
        ...(showImage ? undefined : { backgroundColor: thumbColor(seed) }),
        ...style,
      }}
    >
      {showImage && (
        <img
          src={src ?? undefined}
          alt={alt}
          loading="lazy"
          onError={() => setFailedSrc(src ?? null)}
          className="size-full object-cover"
        />
      )}
      {children}
    </div>
  );
}
