import type { BillingRepository } from "@/domain/repository/billingRepository";
import { billingDataSource } from "@/data/datasource/billingDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toInvoice, toUsageMeter } from "@/data/mapper/billing";

export const billingRepository: BillingRepository = {
  useUsage() {
    const { data, isLoading, error, refetch } =
      billingDataSource.useUsageQuery();
    return {
      data: data && data.map(toUsageMeter),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },

  useInvoices() {
    const { data, isLoading, error, refetch } =
      billingDataSource.useInvoicesQuery();
    return {
      data: data && data.map(toInvoice),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },
};
