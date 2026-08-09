/** `GET /api/v1/streak` のレスポンス型 */
export interface MilestoneDto {
  days: number;
  remaining: number;
  progress: number;
}

export interface BadgeDto {
  days: number;
  glyph: string;
  earned: boolean;
}

export interface StreakOverviewDto {
  current: number;
  longest: number;
  monthlyRate: number;
  totalRecords: number;
  totalDays: number;
  yearHeatmap: number[][];
  weeklyRates: number[];
  nextMilestone: MilestoneDto;
  badges: BadgeDto[];
}
