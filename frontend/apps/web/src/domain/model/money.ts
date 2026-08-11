/**
 * 金額。最小通貨単位の整数 + 通貨コードで持つ
 * （`docs/api-contract.md`「金額は最小通貨単位の整数 + 通貨コード」）。
 *
 * "¥980" のような整形済み文字列で持つと計算も通貨の切り替えもできない。
 * 表示は presentation/format/money.ts が担う。
 */
export interface Money {
  /** 円なら「円」、ドルなら「セント」単位 */
  amount: number;
  /** ISO 4217（"JPY" / "USD"） */
  currency: string;
}

export function money(amount: number, currency = "JPY"): Money {
  return { amount, currency };
}
