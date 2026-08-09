import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { InsightsDto, MonthlyReportDto } from "@/data/dto/insights";

/* モック。差し替え手順は baseApi.ts のコメントを参照 */
const RECORD_DAYS = [8, 12, 15, 11, 18, 22, 19, 24, 21, 26, 23, 26];

const INSIGHTS: InsightsDto = {
  kpis: [
    { key: "record_days", value: 26, total: 30, delta: 3 },
    { key: "avg_sketch_minutes", value: 11.4, total: null, delta: 2.1 },
    { key: "mood_score", value: 4.2, total: 5, delta: -0.1 },
    { key: "journal_count", value: 18, total: null, delta: 5 },
  ],
  // 直近12か月。2025年5月から 2026年4月まで
  monthly: RECORD_DAYS.map((days, i) => ({
    month: `${2025 + Math.floor((4 + i) / 12)}-${String(((4 + i) % 12) + 1).padStart(2, "0")}-01T00:00:00Z`,
    days,
  })),
  habitRates: [
    { title: "5分スケッチ", rate: 0.86 },
    { title: "朝のストレッチ", rate: 0.74 },
    { title: "1日1ページ読書", rate: 0.62 },
    { title: "夜のリフレクション", rate: 0.48 },
  ],
  hourly: [
    2, 1, 0, 0, 0, 1, 6, 14, 9, 4, 3, 2, 5, 3, 2, 1, 3, 6, 8, 11, 15, 9, 4, 2,
  ],
};

const REPORT: MonthlyReportDto = {
  month: "2026-04-01T00:00:00Z",
  headline: "「休んだ日のあとに、必ず戻ってきた月でした。」",
  summary:
    "4月は26日記録。3日以上空いたのは一度もなく、途切れかけた4/11 のあと翌日に再開しています。",
  stats: [
    { key: "record_days", value: 26 },
    { key: "artworks", value: 12 },
    { key: "journals", value: 18 },
  ],
  highlights: [
    {
      date: "2026-04-22T00:00:00Z",
      title: "線が迷わなくなった日",
      seed: 1,
    },
    { date: "2026-04-14T00:00:00Z", title: "14日連続を達成", seed: 0 },
    { date: "2026-04-06T00:00:00Z", title: "初めて人に見せた", seed: 3 },
  ],
  findings: [
    "朝7時台に描いた日は、平均滞在時間が2.4倍長い。",
    "「うまくいかない」と書いた翌日の継続率は 91%。落ち込んだ日ほど戻ってきている。",
    "週末より平日のほうが達成率が高い（92% vs 68%）。休みの日の設計を変えると伸びしろがある。",
  ],
  suggestions: [
    {
      title: "土日だけ「3分版」をつくる",
      reason: "週末の達成率 68% → 85% を狙う",
    },
    {
      title: "夜のリフレクションを22時に前倒し",
      reason: "就寝前だと 48% で止まっている",
    },
    { title: "作品集の章立てを決める", reason: "6月の100枚に向けて" },
  ],
  comparison: [
    { key: "record_days", prev: 0.77, current: 0.87 },
    { key: "avg_sketch_minutes", prev: 0.62, current: 0.78 },
    { key: "journal_count", prev: 0.52, current: 0.72 },
    { key: "mood_score", prev: 0.86, current: 0.84 },
  ],
};

export const insightsDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    insights: build.query<InsightsDto, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: INSIGHTS };
      },
      providesTags: ["Insights"],
    }),

    monthlyReport: build.query<MonthlyReportDto, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: REPORT };
      },
      providesTags: [{ type: "Insights", id: "monthly" }],
    }),
  }),
});
