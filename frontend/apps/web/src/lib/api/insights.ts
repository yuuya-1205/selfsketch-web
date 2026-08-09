import { baseApi, mockDelay } from "./baseApi";
import type { InsightsData, MonthlyReport } from "./types";

const INSIGHTS: InsightsData = {
  kpis: [
    { label: "記録した日", value: "26", unit: "/ 30日", delta: "+3日 vs 先月", up: true },
    { label: "平均スケッチ時間", value: "11.4", unit: "分", delta: "+2.1分", up: true },
    { label: "気分スコア", value: "4.2", unit: "/ 5", delta: "-0.1", up: false },
    { label: "ジャーナル", value: "18", unit: "本", delta: "+5本", up: true },
  ],
  monthlyRecordDays: [8, 12, 15, 11, 18, 22, 19, 24, 21, 26, 23, 26],
  monthLabels: [
    "5月", "6月", "7月", "8月", "9月", "10月",
    "11月", "12月", "1月", "2月", "3月", "4月",
  ],
  habitRates: [
    { title: "5分スケッチ", rate: 0.86 },
    { title: "朝のストレッチ", rate: 0.74 },
    { title: "1日1ページ読書", rate: 0.62 },
    { title: "夜のリフレクション", rate: 0.48 },
  ],
  hourly: [
    2, 1, 0, 0, 0, 1, 6, 14, 9, 4, 3, 2,
    5, 3, 2, 1, 3, 6, 8, 11, 15, 9, 4, 2,
  ],
};

const REPORT: MonthlyReport = {
  monthLabel: "2026年4月のレポート",
  headline: "「休んだ日のあとに、必ず戻ってきた月でした。」",
  summary:
    "4月は26日記録。3日以上空いたのは一度もなく、途切れかけた4/11 のあと翌日に再開しています。",
  stats: [
    { label: "記録日", value: "26日" },
    { label: "作品", value: "12点" },
    { label: "ジャーナル", value: "18本" },
  ],
  highlights: [
    { date: "4/22", title: "線が迷わなくなった日", seed: 1 },
    { date: "4/14", title: "14日連続を達成", seed: 0 },
    { date: "4/06", title: "初めて人に見せた", seed: 3 },
  ],
  findings: [
    "朝7時台に描いた日は、平均滞在時間が2.4倍長い。",
    "「うまくいかない」と書いた翌日の継続率は 91%。落ち込んだ日ほど戻ってきている。",
    "週末より平日のほうが達成率が高い（92% vs 68%）。休みの日の設計を変えると伸びしろがある。",
  ],
  suggestions: [
    { title: "土日だけ「3分版」をつくる", reason: "週末の達成率 68% → 85% を狙う" },
    { title: "夜のリフレクションを22時に前倒し", reason: "就寝前だと 48% で止まっている" },
    { title: "作品集の章立てを決める", reason: "6月の100枚に向けて" },
  ],
  comparison: [
    { label: "記録日数", prev: 0.77, current: 0.87 },
    { label: "平均時間", prev: 0.62, current: 0.78 },
    { label: "ジャーナル", prev: 0.52, current: 0.72 },
    { label: "気分スコア", prev: 0.86, current: 0.84 },
  ],
};

export const insightsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    insights: build.query<InsightsData, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: INSIGHTS };
      },
      providesTags: ["Insights"],
    }),

    monthlyReport: build.query<MonthlyReport, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: REPORT };
      },
      providesTags: [{ type: "Insights", id: "monthly" }],
    }),
  }),
});

export const { useInsightsQuery, useMonthlyReportQuery } = insightsApi;
