import type { KpiKey, ReportStatKey } from "@/domain/model/insights";

/** `GET /api/v1/insights` と `/insights/monthly` のレスポンス型 */
export interface InsightsDto {
  kpis: { key: KpiKey; value: number; total: number | null; delta: number }[];
  /** month は RFC 3339 / UTC のその月の 1日 */
  monthly: { month: string; days: number }[];
  habitRates: { title: string; rate: number }[];
  hourly: number[];
}

export interface MonthlyReportDto {
  /** RFC 3339 / UTC。その月の 1日 */
  month: string;
  headline: string;
  summary: string;
  stats: { key: ReportStatKey; value: number }[];
  /** date は RFC 3339 / UTC */
  highlights: { date: string; title: string; seed: number }[];
  findings: string[];
  suggestions: { title: string; reason: string }[];
  comparison: { key: KpiKey; prev: number; current: number }[];
}
