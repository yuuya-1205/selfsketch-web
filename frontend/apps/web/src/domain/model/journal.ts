/** 記録時の気分。表示ラベルと色は presentation の辞書が持つ */
export type Mood = "calm" | "bright" | "sleepy" | "positive" | "stuck";

/** その日の記録の集計。「習慣 4/5 達成」のような文字列には潰さない */
export interface JournalStats {
  habitsCompleted: number;
  habitsTotal: number;
  /** 1–5 */
  moodScore: number;
  sketchCount: number;
}

export interface JournalEntry {
  id: string;
  /** 書いた日時 */
  writtenAt: Date;
  title: string;
  excerpt: string;
  /** 段落ごとに分けた本文 */
  body: string[];
  hasImage: boolean;
  /** 紐づいた習慣の名前 */
  habitTitle: string;
  mood: Mood;
  /** 「#」を含まない素のタグ */
  tags: string[];
  /** かぎ括弧を含む引用文。接尾辞（「— 今日のひとこと」）は付けない */
  quote: string;
  stats: JournalStats;
}

/** 0–1。習慣が 0 件なら 0 */
export function habitCompletionRate(stats: JournalStats): number {
  return stats.habitsTotal === 0
    ? 0
    : stats.habitsCompleted / stats.habitsTotal;
}
