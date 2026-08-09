import type { FutureRepository } from "@/domain/repository/futureRepository";
import { futureDataSource } from "@/data/datasource/futureDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toVision } from "@/data/mapper/vision";

export const futureRepository: FutureRepository = {
  useVision(id) {
    const { data, isLoading, error } = futureDataSource.useVisionQuery(id);
    return {
      data: data && toVision(data),
      isLoading,
      error: toDomainError(error),
    };
  },
};
