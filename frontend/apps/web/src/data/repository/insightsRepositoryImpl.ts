import type { InsightsRepository } from "@/domain/repository/insightsRepository";
import { insightsDataSource } from "@/data/datasource/insightsDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toInsights, toMonthlyReport } from "@/data/mapper/insights";

export const insightsRepository: InsightsRepository = {
  useInsights() {
    const { data, isLoading, error } = insightsDataSource.useInsightsQuery();
    return {
      data: data && toInsights(data),
      isLoading,
      error: toDomainError(error),
    };
  },

  useMonthlyReport() {
    const { data, isLoading, error } =
      insightsDataSource.useMonthlyReportQuery();
    return {
      data: data && toMonthlyReport(data),
      isLoading,
      error: toDomainError(error),
    };
  },
};
