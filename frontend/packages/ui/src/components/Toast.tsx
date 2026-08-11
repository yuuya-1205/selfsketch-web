import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ToastProps {
  /** lucide のアイコン要素 */
  icon?: ReactNode;
  title: string;
  /** 何が起きたかを 1 行で。楽観更新を巻き戻したときは必ず書く */
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

/**
 * 画面を保ったまま失敗を知らせる（.pen の W-State 1 「トースト」）。
 *
 * 楽観更新が巻き戻ったことは必ず伝える。黙って元に戻すと
 * 「押したのに反映されない」と受け取られる（.pen の設計メモ）。
 */
export function Toast({
  icon,
  title,
  description,
  action,
  className,
}: ToastProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex w-[380px] max-w-[calc(100vw-32px)] items-center gap-2.5 rounded-xl bg-nav px-4 py-3.5",
        className,
      )}
    >
      {icon && <span className="shrink-0 text-nav-fg">{icon}</span>}

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-xs font-bold text-paper">{title}</span>
        {description && (
          <span className="text-[11px] text-nav-label">{description}</span>
        )}
      </span>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="shrink-0 text-xs font-bold text-paper underline-offset-2 hover:underline"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
