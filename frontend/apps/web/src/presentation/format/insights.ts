import type {
  Kpi,
  KpiKey,
  ReportStat,
  ReportStatKey,
} from "@/domain/model/insights";

export const KPI_LABEL: Record<KpiKey, string> = {
  record_days: "記録した日",
  avg_sketch_minutes: "平均スケッチ時間",
  mood_score: "気分スコア",
  journal_count: "ジャーナル",
};

/** delta に付ける単位。「+3日」「+2.1分」「-0.1」「+5本」 */
const DELTA_UNIT: Record<KpiKey, string> = {
  record_days: "日",
  avg_sketch_minutes: "分",
  mood_score: "",
  journal_count: "本",
};

/** 「/ 30日」「分」「/ 5」「本」 */
export function kpiUnitLabel(kpi: Kpi): string {
  if (kpi.total !== null) {
    return `/ ${kpi.total}${DELTA_UNIT[kpi.key]}`;
  }
  return DELTA_UNIT[kpi.key];
}

/** 「+3日 vs 先月」。先月比の注記は記録日だけに付ける（.pen どおり） */
export function kpiDeltaLabel(kpi: Kpi): string {
  const sign = kpi.delta > 0 ? "+" : "";
  const body = `${sign}${kpi.delta}${DELTA_UNIT[kpi.key]}`;
  return kpi.key === "record_days" ? `${body} vs 先月` : body;
}

const REPORT_STAT: Record<ReportStatKey, { label: string; unit: string }> = {
  record_days: { label: "記録日", unit: "日" },
  artworks: { label: "作品", unit: "点" },
  journals: { label: "ジャーナル", unit: "本" },
};

export function reportStatLabel(stat: ReportStat): string {
  return REPORT_STAT[stat.key].label;
}

export function reportStatValue(stat: ReportStat): string {
  return `${stat.value}${REPORT_STAT[stat.key].unit}`;
}

/** 「2026年4月のレポート」 */
export function reportTitle(month: Date): string {
  return `${month.getFullYear()}年${month.getMonth() + 1}月のレポート`;
}

/** 「5月」 */
export function monthShortLabel(month: Date): string {
  return `${month.getMonth() + 1}月`;
}
