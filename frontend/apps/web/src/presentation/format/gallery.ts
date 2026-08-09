/** 「2026年 4月」 */
export function galleryMonthLabel(month: Date): string {
  return `${month.getFullYear()}年 ${month.getMonth() + 1}月`;
}

/** 「12点 · 達成率 92%」。補足が無ければ点数だけ */
export function gallerySummaryLabel(
  count: number,
  note: string | null,
): string {
  return note ? `${count}点 · ${note}` : `${count}点`;
}

/** 「4/22」 */
export function galleryDayLabel(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
