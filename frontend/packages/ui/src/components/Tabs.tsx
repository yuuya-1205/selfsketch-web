import { cn } from "../lib/cn";

export interface TabsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange?: (v: T) => void;
  className?: string;
}

/** 下線タイプのタブ（ユーザー詳細などで使用） */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn("flex w-full gap-0.5 border-b border-line", className)}
    >
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          type="button"
          aria-selected={o === value}
          onClick={() => onChange?.(o)}
          className={cn(
            "-mb-px border-b-2 px-3.5 py-2.5 text-xs whitespace-nowrap transition-colors",
            o === value
              ? "border-ink font-bold text-ink"
              : "border-transparent font-medium text-brown hover:text-ink",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
