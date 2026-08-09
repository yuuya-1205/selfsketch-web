/**
 * 今日ダッシュボードのドメインモデル。
 *
 * `docs/api-contract.md` の方針どおり、整形済みの文字列は持たない。
 * 日時は Date、列挙は英小文字のスネークケース、相対日数は持たずに
 * 基準日時から presentation が算出する。
 */

export type HabitSlot =
  "morning" | "after_wake" | "noon" | "afternoon" | "night" | "before_sleep";

export interface Habit {
  id: string;
  title: string;
  done: boolean;
  slot: HabitSlot;
  /** 完了した時刻。未完了なら null */
  completedAt: Date | null;
  /** 所要時間の目安（分）。決めていなければ null */
  estimatedMinutes: number | null;
  /** 目安が概算か（「10分ほど」のように濁して見せる） */
  estimateIsApproximate: boolean;
}

export type WeekStart = "monday" | "sunday";

export interface StreakSummary {
  current: number;
  longest: number;
  /** 週の各日を記録したか。週の起点は weekStartsOn が決める */
  week: boolean[];
  weekStartsOn: WeekStart;
}

export interface FutureSelfSummary {
  title: string;
  /** 目標の到達予定日。「あと312日」はここから算出する */
  targetDate: Date;
  /** 0–1 */
  progress: number;
  thumbnailUrl: string | null;
}

export interface TodayDashboard {
  date: Date;
  habits: Habit[];
  streak: StreakSummary;
  future: FutureSelfSummary;
  todayQuote: string;
  /** 直近7日の達成率（0–1） */
  weekCompletion: number[];
  sketchLogged: boolean;
}

/* ---- 型に属する計算 ------------------------------------------------ */

export function completedCount(dashboard: TodayDashboard): number {
  return dashboard.habits.filter((h) => h.done).length;
}

export function totalCount(dashboard: TodayDashboard): number {
  return dashboard.habits.length;
}

/** 0–1。習慣が 0 件なら 0 */
export function completionRate(dashboard: TodayDashboard): number {
  const total = totalCount(dashboard);
  return total === 0 ? 0 : completedCount(dashboard) / total;
}

/** 到達予定日までの残り日数。過ぎていれば 0 */
export function remainingDays(future: FutureSelfSummary, now: Date): number {
  const ms = future.targetDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
