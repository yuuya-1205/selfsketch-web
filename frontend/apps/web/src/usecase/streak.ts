import { daysToBest, earnedBadgeCount } from "@/domain/model/streak";
import { useRepositories } from "@/presentation/di/repositories";

export function useStreakOverview() {
  const { data, isLoading, error, retry } =
    useRepositories().streak.useOverview();

  return {
    streak: data,
    isLoading,
    error,
    retry,
    earnedBadgeCount: data ? earnedBadgeCount(data) : 0,
    daysToBest: data ? daysToBest(data) : 0,
  };
}
