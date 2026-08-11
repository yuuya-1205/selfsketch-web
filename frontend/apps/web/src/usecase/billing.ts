import { useRepositories } from "@/presentation/di/repositories";

export function useUsageMeters() {
  const { data, isLoading, error, retry } =
    useRepositories().billing.useUsage();
  return { meters: data, isLoading, error, retry };
}

export function useInvoices() {
  const { data, isLoading, error, retry } =
    useRepositories().billing.useInvoices();
  return { invoices: data, isLoading, error, retry };
}
