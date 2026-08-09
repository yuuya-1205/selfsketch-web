import type { StreakOverview } from "@/domain/model/streak";
import type { RepositoryResult } from "./result";

export interface StreakRepository {
  useOverview(): RepositoryResult<StreakOverview>;
}
