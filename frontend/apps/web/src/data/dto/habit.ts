import type { HabitSlotDto } from "./today";

/** `GET /api/v1/habits/{id}` のレスポンス型 */
export interface HabitNoteDto {
  /** RFC 3339 / UTC */
  date: string;
  body: string;
}

export interface HabitDetailDto {
  id: string;
  title: string;
  slot: HabitSlotDto;
  /** "07:00" 形式の 24 時間表記。決めていなければ null */
  scheduledTime: string | null;
  durationMinutes: number;
  linkedVision: { id: string; title: string } | null;
  achievementRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCount: number;
  /** RFC 3339 / UTC */
  startedAt: string;
  heatmap: number[][];
  notes: HabitNoteDto[];
}
