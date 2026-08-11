import {
  completedCount,
  completionRate,
  totalCount,
} from "@/domain/model/today";
import { useRepositories } from "@/presentation/di/repositories";

/**
 * 今日ダッシュボードの読み取り。
 * 画面が必要とする値をここで揃えるので、画面側で計算しない。
 */
export function useTodayDashboard() {
  const { data, isLoading, error, retry } =
    useRepositories().today.useDashboard();

  return {
    dashboard: data,
    isLoading,
    error,
    retry,
    completedCount: data ? completedCount(data) : 0,
    totalCount: data ? totalCount(data) : 0,
    completionRate: data ? completionRate(data) : 0,
  };
}

/** 習慣の完了状態を切り替える */
export function useToggleHabit() {
  return useRepositories().today.useToggleHabit();
}
