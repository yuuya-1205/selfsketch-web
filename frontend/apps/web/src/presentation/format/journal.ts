import type { Mood } from "@/domain/model/journal";
import type { JournalStats } from "@/domain/model/journal";

export const MOOD_LABEL: Record<Mood, string> = {
  calm: "穏やか",
  bright: "明るい",
  sleepy: "眠い",
  positive: "前向き",
  stuck: "停滞",
};

/** 一覧の左端に出す気分の色。トークンに無い中間色なので辞書で持つ */
export const MOOD_COLOR: Record<Mood, string> = {
  calm: "#8b6f47",
  bright: "#c9a87c",
  sleepy: "#a68960",
  positive: "#8b6f47",
  stuck: "#d4b896",
};

/** 「4月22日 (火)」 */
export function journalDateLabel(date: Date): string {
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${date.getMonth() + 1}月${date.getDate()}日 (${weekday})`;
}

/** 「2026年4月22日 (火) · 7:32」 */
export function journalTimestampLabel(date: Date): string {
  const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  return `${date.getFullYear()}年${journalDateLabel(date)} · ${time}`;
}

/** 「習慣 4/5 達成」「気分スコア 4.2」「スケッチ 1枚」 */
export function journalStatLabels(stats: JournalStats): string[] {
  return [
    `習慣 ${stats.habitsCompleted}/${stats.habitsTotal} 達成`,
    `気分スコア ${stats.moodScore}`,
    `スケッチ ${stats.sketchCount}枚`,
  ];
}
