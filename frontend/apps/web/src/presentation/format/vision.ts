import type { Horizon } from "@/domain/model/vision";

export const HORIZON_LABEL: Record<Horizon, string> = {
  "6_months": "6か月",
  "1_year": "1年",
  "3_years": "3年",
  "10_years": "10年",
};

export const HORIZONS: Horizon[] = [
  "6_months",
  "1_year",
  "3_years",
  "10_years",
];

/** 「2027年4月」 */
export function visionTargetLabel(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

/** マイルストーンの「6月」 */
export function milestoneMonthLabel(date: Date): string {
  return `${date.getMonth() + 1}月`;
}

/** ステップの「いま」「3か月後」「1年後」 */
export function stepWhenLabel(offsetMonths: number): string {
  if (offsetMonths === 0) return "いま";
  if (offsetMonths % 12 === 0) return `${offsetMonths / 12}年後`;
  return `${offsetMonths}か月後`;
}
