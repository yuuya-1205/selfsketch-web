/** `GET /api/v1/me/subscription` のレスポンス型 */
export interface MoneyDto {
  /** 最小通貨単位の整数 */
  amount: number;
  /** ISO 4217 */
  currency: string;
}

export interface InvoiceDto {
  id: string;
  /** RFC 3339 / UTC */
  issuedAt: string;
  description: string;
  amount: MoneyDto;
  status: "paid" | "refunded" | "failed";
}

export interface UsageMeterDto {
  id: "future_generation" | "artwork_storage" | "export";
  used: number;
  limit: number;
  /** RFC 3339 / UTC。リセットの無いものは null */
  resetsAt: string | null;
}
