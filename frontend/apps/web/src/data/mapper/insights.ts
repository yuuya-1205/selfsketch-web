import type { Insights, MonthlyReport } from "@/domain/model/insights";
import type { InsightsDto, MonthlyReportDto } from "@/data/dto/insights";

export function toInsights(dto: InsightsDto): Insights {
  return {
    kpis: dto.kpis.map((k) => ({ ...k })),
    monthly: dto.monthly.map((m) => ({
      month: new Date(m.month),
      days: m.days,
    })),
    habitRates: dto.habitRates.map((h) => ({ ...h })),
    hourly: dto.hourly,
  };
}

export function toMonthlyReport(dto: MonthlyReportDto): MonthlyReport {
  return {
    month: new Date(dto.month),
    headline: dto.headline,
    summary: dto.summary,
    stats: dto.stats.map((s) => ({ ...s })),
    highlights: dto.highlights.map((h) => ({
      date: new Date(h.date),
      title: h.title,
      seed: h.seed,
    })),
    findings: dto.findings,
    suggestions: dto.suggestions.map((s) => ({ ...s })),
    comparison: dto.comparison.map((c) => ({ ...c })),
  };
}
