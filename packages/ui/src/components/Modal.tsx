import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

export interface ModalProps {
  open?: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** パネルの最大幅 */
  width?: number;
  /** ヘッダー・フッターを持たない素の箱にする */
  bare?: boolean;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Modal({
  open = true,
  onClose,
  title,
  description,
  width = 560,
  bare,
  footer,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/70 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={cn(
          "flex max-h-full w-full flex-col overflow-hidden rounded-[18px] bg-paper shadow-[0_18px_48px_rgba(42,26,13,0.33)]",
          className,
        )}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {!bare && (
          <div className="flex shrink-0 items-center gap-3 border-b border-line px-6 py-5">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              {title && (
                <h2 className="text-lg font-bold text-ink">{title}</h2>
              )}
              {description && (
                <p className="text-xs text-muted">{description}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="閉じる"
              onClick={onClose}
              className="shrink-0 text-muted transition-colors hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-line bg-surface px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
