import type { ReactNode } from "react";
import { cn } from "@selfsketch/ui";

export interface Column {
  key: string;
  label: string;
  /** 未指定なら残り幅を分け合う */
  width?: number;
  align?: "left" | "right";
}

export function DataTable({
  columns,
  children,
  title,
  action,
  className,
}: {
  columns: Column[];
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[13px] border border-line-strong bg-paper",
        className,
      )}
    >
      {title && (
        <div className="flex shrink-0 items-center gap-2 border-b border-line bg-surface px-4.5 py-3.5">
          <span className="text-xs font-bold text-ink">{title}</span>
          <span className="h-px flex-1" />
          {action}
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2.5 border-b border-line bg-surface px-3.5 py-2.5">
        {columns.map((c) => (
          <span
            key={c.key}
            className={cn(
              "text-[10px] font-bold tracking-[1px] text-muted",
              c.align === "right" && "text-right",
              !c.width && "min-w-0 flex-1",
            )}
            style={c.width ? { width: c.width, flexShrink: 0 } : undefined}
          >
            {c.label}
          </span>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

export function Row({
  children,
  selected,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 border-b border-line px-3.5 py-2.5 last:border-0",
        selected && "bg-surface",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Cell({
  children,
  width,
  align,
  className,
}: {
  children: ReactNode;
  width?: number;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 truncate text-xs text-ink",
        align === "right" && "text-right",
        !width && "flex-1",
        className,
      )}
      style={width ? { width, flexShrink: 0 } : undefined}
    >
      {children}
    </div>
  );
}

/** 状態を表す小さなドット + ラベル */
export function StatusDot({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "danger" | "muted";
  children: ReactNode;
}) {
  const color = {
    ok: "bg-ok text-ok",
    warn: "bg-warn text-warn",
    danger: "bg-danger text-danger",
    muted: "bg-muted text-muted",
  }[tone];
  const [dot, text] = color.split(" ");
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-1.75 shrink-0 rounded-full", dot)} />
      <span className={cn("truncate text-[11px] font-semibold", text)}>
        {children}
      </span>
    </span>
  );
}

export function Pill({
  tone = "track",
  children,
}: {
  tone?: "track" | "solid" | "ok" | "warn" | "danger";
  children: ReactNode;
}) {
  const cls = {
    track: "bg-track text-brown",
    solid: "bg-ink text-paper",
    ok: "bg-ok-bg text-ok",
    warn: "bg-warn-bg text-warn",
    danger: "bg-danger-bg text-danger",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-bold",
        cls,
      )}
    >
      {children}
    </span>
  );
}
