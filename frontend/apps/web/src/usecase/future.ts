import { useRepositories } from "@/presentation/di/repositories";

/** 到達予定日までの残り日数。過ぎていれば 0 */
function daysUntil(target: Date, now: Date): number {
  return Math.max(
    0,
    Math.ceil((target.getTime() - now.getTime()) / 86_400_000),
  );
}

/** id 未指定は「いま表示中のビジョン」 */
export function useVision(id?: string) {
  const { data, isLoading, error } = useRepositories().future.useVision(id);

  return {
    vision: data,
    isLoading,
    error,
    // 残り日数は焼き込まず targetDate から出す
    remainingDays: data ? daysUntil(data.targetDate, new Date()) : 0,
  };
}
