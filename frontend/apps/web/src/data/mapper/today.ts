import type {
  FutureSelfSummary,
  Habit,
  StreakSummary,
  TodayDashboard,
} from "@/domain/model/today";
import type {
  FutureSelfSummaryDto,
  HabitDto,
  StreakSummaryDto,
  TodayDashboardDto,
} from "@/data/dto/today";

/**
 * DTO -> ドメインモデル。
 * 日時文字列を Date にするのはここだけ。上の層に文字列の日時を漏らさない。
 */

export function toHabit(dto: HabitDto): Habit {
  return {
    id: dto.id,
    title: dto.title,
    done: dto.done,
    slot: dto.slot,
    completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
    estimatedMinutes: dto.estimatedMinutes,
    estimateIsApproximate: dto.estimateIsApproximate,
  };
}

export function toStreakSummary(dto: StreakSummaryDto): StreakSummary {
  return {
    current: dto.current,
    longest: dto.longest,
    week: dto.week,
    weekStartsOn: dto.weekStartsOn,
  };
}

export function toFutureSelfSummary(
  dto: FutureSelfSummaryDto,
): FutureSelfSummary {
  return {
    title: dto.title,
    targetDate: new Date(dto.targetDate),
    progress: dto.progress,
    thumbnailUrl: dto.thumbnailUrl,
  };
}

export function toTodayDashboard(dto: TodayDashboardDto): TodayDashboard {
  return {
    date: new Date(dto.date),
    habits: dto.habits.map(toHabit),
    streak: toStreakSummary(dto.streak),
    future: toFutureSelfSummary(dto.future),
    todayQuote: dto.todayQuote,
    weekCompletion: dto.weekCompletion,
    sketchLogged: dto.sketchLogged,
  };
}
