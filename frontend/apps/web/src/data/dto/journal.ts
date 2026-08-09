/** `GET /api/v1/journal/entries` のレスポンス型 */
export type MoodDto = "calm" | "bright" | "sleepy" | "positive" | "stuck";

export interface JournalStatsDto {
  habitsCompleted: number;
  habitsTotal: number;
  moodScore: number;
  sketchCount: number;
}

export interface JournalEntryDto {
  id: string;
  /** RFC 3339 / UTC */
  writtenAt: string;
  title: string;
  excerpt: string;
  body: string[];
  hasImage: boolean;
  habitTitle: string;
  mood: MoodDto;
  tags: string[];
  quote: string;
  stats: JournalStatsDto;
}
