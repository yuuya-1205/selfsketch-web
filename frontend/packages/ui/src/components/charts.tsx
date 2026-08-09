import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/* ------------------------------------------------------------------ *
 * 縦棒グラフ
 * ------------------------------------------------------------------ */
export interface BarChartProps {
  /** 0–1 に正規化した値 */
  values: number[];
  labels?: string[];
  /** 棒の上に出す値ラベル */
  valueLabels?: string[];
  height?: number;
  /** 強調する index */
  highlight?: number;
  className?: string;
  gap?: string;
}

export function BarChart({
  values,
  labels,
  valueLabels,
  height = 160,
  highlight,
  className,
  gap = "gap-2",
}: BarChartProps) {
  return (
    <ul className={cn("flex flex-1 items-end justify-between", gap, className)}>
      {values.map((v, i) => (
        <li
          key={i}
          className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
        >
          {valueLabels?.[i] && (
            <span className="text-[9px] font-semibold text-muted">
              {valueLabels[i]}
            </span>
          )}
          <span
            className={cn(
              "w-full rounded-[5px]",
              i === highlight ? "bg-ink" : v >= 1 ? "bg-ink" : "bg-brown",
            )}
            style={{ height: Math.max(4, Math.round(v * height)) }}
          />
          {labels?.[i] && (
            <span className="truncate text-[9px] text-muted">{labels[i]}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ *
 * ヒートマップ（週 × 曜日）
 * ------------------------------------------------------------------ */
const LEVELS = [
  "bg-track",
  "bg-[#e0cba8]",
  "bg-line-strong",
  "bg-brown",
  "bg-ink",
];

export interface HeatmapProps {
  /** 0–4 のレベルを週ごとにまとめた配列（[週][曜日]） */
  weeks: number[][];
  cell?: number;
  className?: string;
  legend?: boolean;
}

export function Heatmap({
  weeks,
  cell = 16,
  className,
  legend,
}: HeatmapProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="flex justify-between gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((lv, di) => (
              <span
                key={di}
                className={cn("rounded-[4px]", LEVELS[lv] ?? LEVELS[0])}
                style={{ width: cell, height: cell }}
              />
            ))}
          </div>
        ))}
      </div>
      {legend && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted">少ない</span>
          {LEVELS.map((c) => (
            <span key={c} className={cn("size-3 rounded-[3px]", c)} />
          ))}
          <span className="text-[10px] text-muted">多い</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * ドーナツ（進捗リング）
 * ------------------------------------------------------------------ */
export interface RingProps {
  /** 0–1 */
  value: number;
  size?: number;
  thickness?: number;
  children?: ReactNode;
  /** 中央の穴の色。濃色カードの上では bg-nav などを渡す */
  holeClassName?: string;
  trackClassName?: string;
  barColor?: string;
}

export function Ring({
  value,
  size = 130,
  thickness = 14,
  children,
  holeClassName = "bg-nav",
  trackClassName = "#5c4126",
  barColor = "#e8d9bf",
}: RingProps) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <div
      className="relative grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${barColor} 0 ${pct}%, ${trackClassName} ${pct}% 100%)`,
      }}
      role="img"
      aria-label={`${pct}%`}
    >
      <div
        className={cn(
          "absolute grid place-items-center rounded-full",
          holeClassName,
        )}
        style={{
          width: size - thickness * 2,
          height: size - thickness * 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * ラベル + 横バー + 値
 * ------------------------------------------------------------------ */
export function MeterRow({
  label,
  value,
  display,
  labelWidth = 120,
  tone = "brown",
}: {
  label: string;
  /** 0–1 */
  value: number;
  display?: string;
  labelWidth?: number;
  tone?: "brown" | "ink";
}) {
  return (
    <div className="flex w-full items-center gap-2.5">
      <span
        className="shrink-0 truncate text-[11px] font-semibold text-ink"
        style={{ width: labelWidth }}
      >
        {label}
      </span>
      <span className="h-[9px] flex-1 overflow-hidden rounded-full bg-track">
        <span
          className={cn(
            "block h-full rounded-full",
            tone === "ink" || value >= 0.8 ? "bg-ink" : "bg-brown",
          )}
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </span>
      <span className="w-10 shrink-0 text-right text-[11px] font-bold text-brown">
        {display ?? `${Math.round(value * 100)}%`}
      </span>
    </div>
  );
}
