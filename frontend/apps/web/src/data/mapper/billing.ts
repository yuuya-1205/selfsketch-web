import type { Invoice, UsageMeter } from "@/domain/model/billing";
import type { Money } from "@/domain/model/money";
import type { InvoiceDto, MoneyDto, UsageMeterDto } from "@/data/dto/billing";

export function toMoney(dto: MoneyDto): Money {
  return { amount: dto.amount, currency: dto.currency };
}

export function toInvoice(dto: InvoiceDto): Invoice {
  return {
    id: dto.id,
    issuedAt: new Date(dto.issuedAt),
    description: dto.description,
    amount: toMoney(dto.amount),
    status: dto.status,
  };
}

export function toUsageMeter(dto: UsageMeterDto): UsageMeter {
  return {
    id: dto.id,
    used: dto.used,
    limit: dto.limit,
    resetsAt: dto.resetsAt ? new Date(dto.resetsAt) : null,
  };
}
