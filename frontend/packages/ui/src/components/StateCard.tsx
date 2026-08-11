import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * 0件・失敗のときに出すカード（.pen の W-State 1 / W-State 2）。
 *
 * 文面は UX Writing ガイドラインに従う:
 * 「ない」を欠落ではなく余白として書き、次の一歩をひとつだけ示す。
 * 命令せず、「！」より「。」で締める。
 */
function StatePanel({
  icon,
  iconSize,
  title,
  titleClassName,
  body,
  bodyWidth,
  bodyClassName,
  actions,
  className,
}: {
  icon: ReactNode;
  iconSize: number;
  title: string;
  titleClassName: string;
  body?: string;
  bodyWidth: number;
  bodyClassName: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 rounded-[14px] border border-line-strong bg-paper p-7 text-center",
        className,
      )}
    >
      <span
        className="grid shrink-0 place-items-center rounded-full bg-track text-brown"
        style={{ width: iconSize, height: iconSize }}
      >
        {icon}
      </span>

      <p className={titleClassName}>{title}</p>

      {body && (
        <p
          className={cn("mx-auto", bodyClassName)}
          style={{ maxWidth: bodyWidth }}
        >
          {body}
        </p>
      )}

      {actions && (
        <div className="flex flex-wrap justify-center gap-2.5">{actions}</div>
      )}
    </div>
  );
}

export interface StateCardProps {
  /** lucide のアイコン要素 */
  icon: ReactNode;
  title: string;
  body?: string;
  /** ボタンなど。次の一歩をひとつだけ置く */
  actions?: ReactNode;
  className?: string;
}

/** ページ全体の取得に失敗したとき（.pen の W-State 1 「全画面」） */
export function ErrorState({
  icon,
  title,
  body,
  actions,
  className,
}: StateCardProps) {
  return (
    <StatePanel
      icon={icon}
      iconSize={52}
      title={title}
      titleClassName="text-[17px] font-bold text-ink"
      body={body}
      bodyWidth={420}
      bodyClassName="text-[13px] leading-[1.8] font-normal text-brown"
      actions={actions}
      className={cn("min-h-[300px]", className)}
    />
  );
}

/** 0件のとき（.pen の W-State 2） */
export function EmptyState({
  icon,
  title,
  body,
  actions,
  className,
}: StateCardProps) {
  return (
    <StatePanel
      icon={icon}
      iconSize={48}
      title={title}
      titleClassName="text-base font-bold text-ink"
      body={body}
      bodyWidth={360}
      bodyClassName="text-xs leading-[1.8] font-normal text-brown"
      actions={actions}
      className={cn("min-h-[210px]", className)}
    />
  );
}

/**
 * 画面の一部だけ失敗したとき（.pen の W-State 1 「インライン」）。
 * 他の内容は出したまま、その区画だけを差し替える。
 */
export function InlineError({
  icon,
  title,
  body,
  tone = "warn",
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  body?: string;
  /** warn = 再試行で直る見込み / danger = 操作が必要 */
  tone?: "warn" | "danger";
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 rounded-[14px] border bg-paper p-5",
        tone === "warn" ? "border-warn" : "border-danger",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className={tone === "warn" ? "text-warn" : "text-danger"}>
          {icon}
        </span>
        <span className="flex-1 text-[13px] font-bold text-ink">{title}</span>
      </div>

      {body && <p className="text-[11px] leading-[1.8] text-brown">{body}</p>}

      {action}
    </div>
  );
}
