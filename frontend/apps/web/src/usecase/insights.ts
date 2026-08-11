import { useRepositories } from "@/presentation/di/repositories";

export function useInsights() {
  const { data, isLoading, error, retry } =
    useRepositories().insights.useInsights();
  return { insights: data, isLoading, error, retry };
}

export function useMonthlyReport() {
  const { data, isLoading, error, retry } =
    useRepositories().insights.useMonthlyReport();
  return { report: data, isLoading, error, retry };
}
