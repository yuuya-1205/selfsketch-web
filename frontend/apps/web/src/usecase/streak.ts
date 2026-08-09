import { daysToBest, earnedBadgeCount } from "@/domain/model/streak";
import { useRepositories } from "@/presentation/di/repositories";

export function useStreakOverview() {
  const { data, isLoading, error } = useRepositories().streak.useOverview();

  return {
    streak: data,
    isLoading,
    error,
    earnedBadgeCount: data ? earnedBadgeCount(data) : 0,
    daysToBest: data ? daysToBest(data) : 0,
  };
}
