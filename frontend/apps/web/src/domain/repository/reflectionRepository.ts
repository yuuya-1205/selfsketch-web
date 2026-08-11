import type { ReflectionEntry } from "@/domain/model/reflection";
import type { RepositoryResult } from "./result";

export interface ReflectionRepository {
  useEntries(): RepositoryResult<ReflectionEntry[]>;
}
