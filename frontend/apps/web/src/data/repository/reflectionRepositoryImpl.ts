import type { ReflectionRepository } from "@/domain/repository/reflectionRepository";
import { reflectionDataSource } from "@/data/datasource/reflectionDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toReflectionEntries } from "@/data/mapper/reflection";

export const reflectionRepository: ReflectionRepository = {
  useEntries() {
    const { data, isLoading, error, refetch } =
      reflectionDataSource.useReflectionEntriesQuery();
    return {
      data: data && toReflectionEntries(data),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },
};
