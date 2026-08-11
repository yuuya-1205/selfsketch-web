const TIME = new Intl.DateTimeFormat("ja-JP", {
  hour: "numeric",
  minute: "2-digit",
});

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 最後に使ったのはいつか（"昨日 22:14" / "3日前" / "未実施"）。
 * 日をまたいだ回数で数えるので、経過時間ではなく日付の変わり目で切る。
 */
export function lastUsedLabel(lastUsedAt: Date | null, now: Date): string {
  if (!lastUsedAt) return "未実施";

  const days = Math.floor(
    (startOfDay(now).getTime() - startOfDay(lastUsedAt).getTime()) / 86_400_000,
  );

  if (days <= 0) return `今日 ${TIME.format(lastUsedAt)}`;
  if (days === 1) return `昨日 ${TIME.format(lastUsedAt)}`;
  if (days < 7) return `${days}日前`;
  if (days < 14) return "先週";
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  if (days < 60) return "先月";
  return `${Math.floor(days / 30)}か月前`;
}
