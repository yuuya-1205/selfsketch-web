import type { TodayRepository } from "@/domain/repository/todayRepository";
import { todayDataSource } from "@/data/datasource/todayDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toTodayDashboard } from "@/data/mapper/today";

/**
 * TodayRepository の実装。
 *
 * DataSource（RTK Query）を呼び、マッパーでドメインモデルに直し、
 * エラーを DomainError に正規化する。上の層は RTK Query を知らない。
 *
 * 変換を useMemo で包んでいないのは、toTodayDashboard が純粋関数で
 * RTK Query の data の参照が安定しているため（同じキャッシュなら同じ参照）。
 * 重い変換が出てきたらそのときに足す。
 */
export const todayRepository: TodayRepository = {
  useDashboard() {
    const { data, isLoading, error, refetch } =
      todayDataSource.useTodayDashboardQuery();
    return {
      data: data && toTodayDashboard(data),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },

  useToggleHabit() {
    const [toggle] = todayDataSource.useToggleHabitMutation();
    return async (id, done) => {
      await toggle({ id, done }).unwrap();
    };
  },
};
