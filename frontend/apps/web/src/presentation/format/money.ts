import type { Money } from "@/domain/model/money";

/** 通貨ごとの小数桁。円は 0、ドルは 2 */
const FRACTION_DIGITS: Record<string, number> = { JPY: 0, USD: 2, EUR: 2 };

/**
 * 金額の表示。domain は最小通貨単位の整数しか持たないので、
 * 通貨記号と桁区切りはここで付ける。
 */
export function formatMoney(value: Money): string {
  const digits = FRACTION_DIGITS[value.currency] ?? 2;
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: value.currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value.amount / 10 ** digits);
}
