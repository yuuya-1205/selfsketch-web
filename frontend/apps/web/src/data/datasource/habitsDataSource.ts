import { mockHeatmap } from "@selfsketch/ui";
import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { HabitDetailDto } from "@/data/dto/habit";

/* モック。差し替え手順は baseApi.ts のコメントを参照 */
const MOCK: HabitDetailDto = {
  id: "h1",
  title: "5分スケッチ",
  slot: "morning",
  scheduledTime: "07:00",
  durationMinutes: 5,
  linkedVision: { id: "v1", title: "1年後の自分" },
  achievementRate: 0.86,
  currentStreak: 12,
  longestStreak: 21,
  totalCount: 148,
  startedAt: "2025-11-01T15:00:00Z",
  heatmap: mockHeatmap(12),
  notes: [
    {
      date: "2026-04-21T15:00:00Z",
      body: "線が迷わなくなってきた。手首から動かす感覚。",
    },
    {
      date: "2026-04-20T15:00:00Z",
      body: "5分で終わらず15分描いた。楽しい日もある。",
    },
    { date: "2026-04-19T15:00:00Z", body: "眠くて雑。でもやった事実は残る。" },
  ],
};

export const habitsDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    habitDetail: build.query<HabitDetailDto, string>({
      // id は実 API 化のときにパスへ乗る。モックは1件しかない
      queryFn: async (id) => {
        await mockDelay();
        return { data: { ...MOCK, id } };
      },
      providesTags: (_result, _error, id) => [{ type: "Habit", id }],
    }),
  }),
});
