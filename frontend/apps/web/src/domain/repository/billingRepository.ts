import type { Invoice, UsageMeter } from "@/domain/model/billing";
import type { RepositoryResult } from "./result";

export interface BillingRepository {
  useUsage(): RepositoryResult<UsageMeter[]>;
  useInvoices(): RepositoryResult<Invoice[]>;
}
