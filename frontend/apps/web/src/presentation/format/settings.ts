const DATE = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "2026/04/01" */
export function settingsDateLabel(date: Date): string {
  return DATE.format(date);
}

const UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

/**
 * バイト数の表示。domain は数値しか持たないのでここで単位を付ける。
 * 1024 区切り（"1GB" が 1GiB を指す一般的な表記に合わせる）。
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0B";

  const exponent = Math.min(
    UNITS.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / 1024 ** exponent;
  // 1桁台だけ小数を出す（1.5GB は出すが 420MB は出さない）
  const rounded =
    value < 10 && exponent > 0
      ? Math.round(value * 10) / 10
      : Math.round(value);
  return `${rounded}${UNITS[exponent]}`;
}

/** "420MB / 1GB" */
export function storageLabel(usedBytes: number, limitBytes: number): string {
  return `${formatBytes(usedBytes)} / ${formatBytes(limitBytes)}`;
}

/** 日付までの残り日数。過ぎていれば 0 */
export function daysUntil(target: Date, now: Date): number {
  const start = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };
  return Math.max(0, Math.round((start(target) - start(now)) / 86_400_000));
}
