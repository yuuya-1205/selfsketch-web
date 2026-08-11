import type { Money } from "./money";

/** 請求の状態。"お支払い済み" のような日本語リテラルは型に入れない */
export type InvoiceStatus = "paid" | "refunded" | "failed";

export interface Invoice {
  id: string;
  issuedAt: Date;
  description: string;
  amount: Money;
  status: InvoiceStatus;
}

/** 使用量メーター。何のメーターかは id で判る */
export type UsageMeterId = "future_generation" | "artwork_storage" | "export";

export interface UsageMeter {
  id: UsageMeterId;
  used: number;
  limit: number;
  /** 使用量がリセットされる日時。リセットの無いものは null */
  resetsAt: Date | null;
}

/** 上限までの残り。超過していれば 0 */
export function remaining(meter: UsageMeter): number {
  return Math.max(0, meter.limit - meter.used);
}
