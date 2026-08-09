/**
 * `GET /api/v1/dashboard/today` のレスポンス型。
 *
 * **サーバが返す形そのまま**を書く。日時は RFC 3339 の UTC 文字列、
 * 列挙は英小文字のスネークケース（`backend-conventions` の API 規約）。
 * Date への変換や表示用の整形はここではやらない（data/mapper の仕事）。
 */

export type HabitSlotDto =
  "morning" | "after_wake" | "noon" | "afternoon" | "night" | "before_sleep";

export interface HabitDto {
  id: string;
  title: string;
  done: boolean;
  slot: HabitSlotDto;
  /** RFC 3339 / UTC。未完了なら null */
  completedAt: string | null;
  estimatedMinutes: number | null;
  estimateIsApproximate: boolean;
}

export interface StreakSummaryDto {
  current: number;
  longest: number;
  week: boolean[];
  weekStartsOn: "monday" | "sunday";
}

export interface FutureSelfSummaryDto {
  title: string;
  /** RFC 3339 / UTC */
  targetDate: string;
  progress: number;
  thumbnailUrl: string | null;
}

export interface TodayDashboardDto {
  /** RFC 3339 / UTC */
  date: string;
  habits: HabitDto[];
  streak: StreakSummaryDto;
  future: FutureSelfSummaryDto;
  todayQuote: string;
  weekCompletion: number[];
  sketchLogged: boolean;
}
