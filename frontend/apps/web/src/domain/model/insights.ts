/** インサイトの主要指標。表示ラベルと単位は presentation の辞書が持つ */
export type KpiKey =
  "record_days" | "avg_sketch_minutes" | "mood_score" | "journal_count";

export interface Kpi {
  key: KpiKey;
  value: number;
  /** 分母（26 / 30日 の 30）。無ければ null */
  total: number | null;
  /** 前月との差。符号つき */
  delta: number;
}

/** 月ごとの記録日数 */
export interface MonthlyRecord {
  month: Date;
  days: number;
}

export interface HabitRate {
  title: string;
  /** 0–1 */
  rate: number;
}

export interface Insights {
  kpis: Kpi[];
  monthly: MonthlyRecord[];
  habitRates: HabitRate[];
  /** 0時から23時までの記録件数 */
  hourly: number[];
}

/** 増えていれば true。0 は増加扱いにしない */
export function isImproving(kpi: Kpi): boolean {
  return kpi.delta > 0;
}

/* ---- 月次レポート -------------------------------------------------- */

export type ReportStatKey = "record_days" | "artworks" | "journals";

export interface ReportStat {
  key: ReportStatKey;
  value: number;
}

export interface ReportHighlight {
  date: Date;
  title: string;
  seed: number;
}

export interface ReportSuggestion {
  title: string;
  reason: string;
}

export interface ReportComparison {
  key: KpiKey;
  /** 0–1 */
  prev: number;
  /** 0–1 */
  current: number;
}

export interface MonthlyReport {
  month: Date;
  headline: string;
  summary: string;
  stats: ReportStat[];
  highlights: ReportHighlight[];
  findings: string[];
  suggestions: ReportSuggestion[];
  comparison: ReportComparison[];
}
