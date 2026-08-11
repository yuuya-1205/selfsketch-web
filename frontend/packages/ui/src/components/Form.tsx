import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { Check, ChevronDown } from "lucide-react";
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

/**
 * 同意チェックなどで使う角丸チェックボックス（.pen の cb ノード相当）。
 * ラベルは呼び出し側が置く（`<label>` で包むか htmlFor で結びつける）。
 */
export function Checkbox({
  checked,
  onChange,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  checked: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <span className={cn("relative grid size-[18px] shrink-0", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer size-full cursor-pointer appearance-none rounded-[5px] border border-line-strong bg-surface checked:border-ink checked:bg-ink focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:outline-none"
        {...props}
      />
      <Check
        size={11}
        strokeWidth={3}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-paper opacity-0 peer-checked:opacity-100"
      />
    </span>
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
