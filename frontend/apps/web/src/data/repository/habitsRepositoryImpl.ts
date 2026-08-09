import type { HabitsRepository } from "@/domain/repository/habitsRepository";
import { habitsDataSource } from "@/data/datasource/habitsDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toHabitDetail } from "@/data/mapper/habit";

export const habitsRepository: HabitsRepository = {
  useDetail(id) {
    const { data, isLoading, error } = habitsDataSource.useHabitDetailQuery(id);
    return {
      data: data && toHabitDetail(data),
      isLoading,
      error: toDomainError(error),
    };
  },
};
