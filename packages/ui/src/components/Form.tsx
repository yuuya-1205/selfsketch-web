import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export function FieldLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-[11px] font-bold tracking-[1.2px] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      {children}
    </label>
  );
}

const CONTROL =
  "w-full rounded-[11px] border border-line-strong bg-surface text-sm text-ink " +
  "placeholder:text-muted focus:border-ink focus:outline-none transition-colors";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, "h-11 px-3.5", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(CONTROL, "resize-none p-3.5 leading-[1.9]", className)}
      {...props}
    />
  );
}

/** 実装は後でネイティブ select / combobox に置き換える表示用ダミー */
export function SelectDisplay({
  value,
  className,
}: {
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-11 w-full items-center gap-2 rounded-[11px] border border-line-strong bg-surface px-3.5",
        className,
      )}
    >
      <span className="flex-1 truncate text-sm font-semibold text-ink">
        {value}
      </span>
      <ChevronDown size={14} className="shrink-0 text-muted" />
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "flex h-[22px] w-[38px] shrink-0 items-center rounded-full p-[3px] transition-colors",
        checked ? "justify-end bg-ink" : "justify-start bg-line-strong",
      )}
    >
      <span className="size-4 rounded-full bg-paper" />
    </button>
  );
}

export function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-[18px] shrink-0 rounded-full bg-paper transition-all",
        checked
          ? "border-[5px] border-ink"
          : "border border-line-strong",
      )}
    />
  );
}
