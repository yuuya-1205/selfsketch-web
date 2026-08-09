import type { Insights, MonthlyReport } from "@/domain/model/insights";
import type { RepositoryResult } from "./result";

export interface InsightsRepository {
  useInsights(): RepositoryResult<Insights>;
  useMonthlyReport(): RepositoryResult<MonthlyReport>;
}
