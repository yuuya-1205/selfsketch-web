import type { StreakOverview } from "@/domain/model/streak";
import type { StreakOverviewDto } from "@/data/dto/streak";

/**
 * 日時を含まないので写すだけだが、マッパーは通す。
 * DTO をそのまま画面へ流すと、API の形が変わったときに画面まで波及するため。
 */
export function toStreakOverview(dto: StreakOverviewDto): StreakOverview {
  return {
    current: dto.current,
    longest: dto.longest,
    monthlyRate: dto.monthlyRate,
    totalRecords: dto.totalRecords,
    totalDays: dto.totalDays,
    yearHeatmap: dto.yearHeatmap,
    weeklyRates: dto.weeklyRates,
    nextMilestone: { ...dto.nextMilestone },
    badges: dto.badges.map((b) => ({ ...b })),
  };
}
