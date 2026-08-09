import type { StreakRepository } from "@/domain/repository/streakRepository";
import { streakDataSource } from "@/data/datasource/streakDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toStreakOverview } from "@/data/mapper/streak";

export const streakRepository: StreakRepository = {
  useOverview() {
    const { data, isLoading, error } =
      streakDataSource.useStreakOverviewQuery();
    return {
      data: data && toStreakOverview(data),
      isLoading,
      error: toDomainError(error),
    };
  },
};
