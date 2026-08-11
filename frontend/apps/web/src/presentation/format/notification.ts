const TIME = new Intl.DateTimeFormat("ja-JP", {
  hour: "numeric",
  minute: "2-digit",
});
const DATE = new Intl.DateTimeFormat("ja-JP", {
  month: "numeric",
  day: "numeric",
});

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * 通知の時刻表示。今日なら "7:00"、それ以外は "4/21"。
 * サーバは RFC 3339 しか返さないので、この整形はここでだけ行う。
 */
export function notificationTimeLabel(receivedAt: Date, now: Date): string {
  return isSameDay(receivedAt, now)
    ? TIME.format(receivedAt)
    : DATE.format(receivedAt);
}
