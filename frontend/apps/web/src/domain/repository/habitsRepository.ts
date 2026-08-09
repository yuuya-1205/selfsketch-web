import type { HabitDetail } from "@/domain/model/habit";
import type { RepositoryResult } from "./result";

export interface HabitsRepository {
  useDetail(id: string): RepositoryResult<HabitDetail>;
}
