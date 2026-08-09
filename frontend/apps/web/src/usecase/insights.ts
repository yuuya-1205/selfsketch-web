import { useRepositories } from "@/presentation/di/repositories";

export function useInsights() {
  const { data, isLoading, error } = useRepositories().insights.useInsights();
  return { insights: data, isLoading, error };
}

export function useMonthlyReport() {
  const { data, isLoading, error } =
    useRepositories().insights.useMonthlyReport();
  return { report: data, isLoading, error };
}
