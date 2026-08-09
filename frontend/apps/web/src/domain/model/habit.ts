import type { HabitSlot } from "./today";

/** 習慣に紐づけた「未来の自分」 */
export interface LinkedVision {
  id: string;
  title: string;
}

export interface HabitNote {
  date: Date;
  body: string;
}

export interface HabitDetail {
  id: string;
  title: string;
  slot: HabitSlot;
  /** 予定時刻。"07:00" 形式の 24 時間表記。決めていなければ null */
  scheduledTime: string | null;
  durationMinutes: number;
  linkedVision: LinkedVision | null;
  /** 0–1 */
  achievementRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCount: number;
  /** 記録を始めた日 */
  startedAt: Date;
  /** 直近12週 × 7日、0–4 のレベル */
  heatmap: number[][];
  notes: HabitNote[];
}

/** 開始からの経過日数。未来日なら 0 */
export function daysSinceStart(habit: HabitDetail, now: Date): number {
  const ms = now.getTime() - habit.startedAt.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
