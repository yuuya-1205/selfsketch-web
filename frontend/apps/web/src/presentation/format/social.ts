const DATE = new Intl.DateTimeFormat("ja-JP", {
  month: "numeric",
  day: "numeric",
});

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 「2時間前」「昨日」。サーバに焼き込ませず閲覧時刻から出す
 * （焼き込むとクライアントの時計とズレる。api-contract.md §1）。
 *
 * 日をまたいだかどうかは経過時間ではなく日付で見る。
 * 23時の出来事を翌1時に見たら「2時間前」ではなく「昨日」が自然なため。
 */
export function relativeTimeLabel(occurredAt: Date, now: Date): string {
  const days = Math.floor(
    (startOfDay(now).getTime() - startOfDay(occurredAt).getTime()) / 86_400_000,
  );

  if (days >= 7) return DATE.format(occurredAt);
  if (days === 1) return "昨日";
  if (days >= 2) return `${days}日前`;

  const minutes = Math.floor((now.getTime() - occurredAt.getTime()) / 60_000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  return `${Math.floor(minutes / 60)}時間前`;
}

/** アバターに出す頭文字。名前から出すのでサーバは持たない */
export function nameInitial(name: string): string {
  return [...name][0] ?? "";
}

/** 連続日数の表示。まだ1日目なら「1日目」 */
export function streakLabel(currentStreak: number): string {
  return currentStreak <= 1 ? "1日目" : `${currentStreak}日連続`;
}

/** 添付された作品の件数表示。0 件なら出さない */
export function sharedWorkLabel(count: number): string | null {
  return count > 0 ? `作品を${count}点シェア` : null;
}
