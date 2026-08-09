import type { JournalEntry } from "@/domain/model/journal";
import type { RepositoryResult } from "./result";

export interface JournalRepository {
  useEntries(): RepositoryResult<JournalEntry[]>;
}
