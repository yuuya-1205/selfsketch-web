/**
 * API 境界の型。
 * バックエンド（Go）実装後は OpenAPI / Protobuf から生成した型に差し替える。
 * UI 側はこのファイルだけを見ているので、影響範囲がここで閉じる。
 */

export type HabitSlot = "毎朝" | "起床後" | "昼" | "午後" | "夜" | "就寝前";

export interface Habit {
  id: string;
  title: string;
  /** 「完了済 · 7:15」「午後 · 10分ほど」など、行の2段目に出る文字列 */
  meta: string;
  done: boolean;
  slot: HabitSlot;
}

export interface StreakSummary {
  current: number;
  longest: number;
  /** 月曜はじまり7日ぶんの達成有無 */
  week: boolean[];
}

export interface FutureSelfSummary {
  title: string;
  remainingDays: number;
  /** 0–1 */
  progress: number;
  thumbnailUrl: string | null;
}

export interface TodayDashboard {
  /** 表示用に整形済みの日付。タイムゾーン変換はサーバー側の責務 */
  dateLabel: string;
  completedCount: number;
  totalCount: number;
  habits: Habit[];
  streak: StreakSummary;
  future: FutureSelfSummary;
  todayQuote: string;
  /** 今週の達成率(0–1) × 7日 */
  weekCompletion: number[];
  sketchLogged: boolean;
}
