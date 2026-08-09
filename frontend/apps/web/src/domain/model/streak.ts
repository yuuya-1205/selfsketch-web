/** 連続記録のマイルストーン。ラベルは日数から presentation が作る */
export interface Milestone {
  days: number;
  remaining: number;
  /** 0–1 */
  progress: number;
}

export interface Badge {
  /** 何日連続で獲得できるか */
  days: number;
  glyph: string;
  earned: boolean;
}

export interface StreakOverview {
  current: number;
  longest: number;
  /** 0–1 */
  monthlyRate: number;
  totalRecords: number;
  totalDays: number;
  /** 52週 × 7日、0–4 のレベル */
  yearHeatmap: number[][];
  /** 直近12週の達成率（0–1） */
  weeklyRates: number[];
  nextMilestone: Milestone;
  badges: Badge[];
}

export function earnedBadgeCount(streak: StreakOverview): number {
  return streak.badges.filter((b) => b.earned).length;
}

/**
 * 自己ベストまであと何日か。既に更新中なら 0。
 * 今日ダッシュボードの StreakSummary からも使うので、必要な2つだけを取る。
 */
export function daysToBest(streak: {
  current: number;
  longest: number;
}): number {
  return Math.max(streak.longest - streak.current, 0);
}
