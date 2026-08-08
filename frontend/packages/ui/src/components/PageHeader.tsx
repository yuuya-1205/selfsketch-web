import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/cn";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** 右側に置く操作群 */
  actions?: ReactNode;
  /** タイトル横に置くバッジなど */
  badge?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <h2 className="truncate text-[26px] leading-tight font-bold text-ink">
            {title}
          </h2>
          {badge}
        </div>
        {description && (
          <p className="text-xs font-medium text-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {actions}
        </div>
      )}
    </header>
  );
}

export function BackLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 self-start text-xs font-semibold text-muted transition-colors hover:text-ink"
    >
      <ArrowLeft size={14} />
      {children}
    </button>
  );
}
