import { mockHeatmap } from "@selfsketch/ui";
import { baseApi, mockDelay } from "./baseApi";
import type { HabitDetail } from "./types";

const HABIT_DETAIL: HabitDetail = {
  id: "h1",
  title: "5分スケッチ",
  schedule: "毎朝 7:00",
  duration: "5分",
  linkedVision: "1年後の自分に紐づけ済み",
  achievementRate: 0.86,
  currentStreak: 12,
  longestStreak: 21,
  totalCount: 148,
  startedDaysAgo: 172,
  heatmap: mockHeatmap(12),
  notes: [
    { date: "4/22 (火)", body: "線が迷わなくなってきた。手首から動かす感覚。" },
    { date: "4/21 (月)", body: "5分で終わらず15分描いた。楽しい日もある。" },
    { date: "4/20 (日)", body: "眠くて雑。でもやった事実は残る。" },
  ],
};

export const habitsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    habitDetail: build.query<HabitDetail, string>({
      // id は実 API 化のときにパスへ乗る。モックは1件しかないので今は使わない
      queryFn: async (id) => {
        await mockDelay();
        return { data: { ...HABIT_DETAIL, id } };
      },
      providesTags: (_result, _error, id) => [{ type: "Habit", id }],
    }),
  }),
});

export const { useHabitDetailQuery } = habitsApi;

export const HABIT_SLOT_OPTIONS = ["毎日", "平日のみ", "週3回", "カスタム"] as const;
