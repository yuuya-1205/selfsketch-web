/**
 * 通知の種類。表示ラベルとアイコンは presentation の辞書が持つ
 * （`docs/api-contract.md`「列挙値は英小文字のスネークケース」）。
 */
export type NotificationCategory =
  "reminder" | "achievement" | "friend" | "insight" | "future";

export interface Notification {
  id: string;
  title: string;
  category: NotificationCategory;
  /** 届いた日時。"7:00" のような整形済み文字列は持たない */
  receivedAt: Date;
  read: boolean;
}

/** 新着からの距離。見出しの文言は presentation が引く */
export type NotificationBucket = "today" | "this_week" | "earlier";

export interface NotificationGroup {
  bucket: NotificationBucket;
  items: Notification[];
}

export function unreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** 何日前か。同じ日なら 0 */
function daysAgo(receivedAt: Date, now: Date): number {
  const diff = startOfDay(now).getTime() - startOfDay(receivedAt).getTime();
  return Math.floor(diff / 86_400_000);
}

export function bucketOf(
  notification: Notification,
  now: Date,
): NotificationBucket {
  const days = daysAgo(notification.receivedAt, now);
  if (days <= 0) return "today";
  if (days < 7) return "this_week";
  return "earlier";
}

const ORDER: NotificationBucket[] = ["today", "this_week", "earlier"];

/**
 * 新しい順に並べ、今日 / 今週 / それ以前へ振り分ける。
 * どこで区切るかはサーバではなく閲覧時刻で決まるので、ここで計算する。
 */
export function groupByRecency(
  notifications: Notification[],
  now: Date,
): NotificationGroup[] {
  const sorted = [...notifications].sort(
    (a, b) => b.receivedAt.getTime() - a.receivedAt.getTime(),
  );

  return ORDER.map((bucket) => ({
    bucket,
    items: sorted.filter((n) => bucketOf(n, now) === bucket),
  })).filter((g) => g.items.length > 0);
}
