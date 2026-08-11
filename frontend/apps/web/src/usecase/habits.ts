import { daysSinceStart } from "@/domain/model/habit";
import { useRepositories } from "@/presentation/di/repositories";

/** 習慣詳細の読み取り。開始からの経過日数もここで出す */
export function useHabitDetail(id: string) {
  const { data, isLoading, error, retry } =
    useRepositories().habits.useDetail(id);

  return {
    habit: data,
    isLoading,
    error,
    retry,
    daysSinceStart: data ? daysSinceStart(data, new Date()) : 0,
  };
}
