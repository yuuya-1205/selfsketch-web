import type { JournalRepository } from "@/domain/repository/journalRepository";
import { journalDataSource } from "@/data/datasource/journalDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toJournalEntry } from "@/data/mapper/journal";

export const journalRepository: JournalRepository = {
  useEntries() {
    const { data, isLoading, error } =
      journalDataSource.useJournalEntriesQuery();
    return {
      data: data?.map(toJournalEntry),
      isLoading,
      error: toDomainError(error),
    };
  },
};
