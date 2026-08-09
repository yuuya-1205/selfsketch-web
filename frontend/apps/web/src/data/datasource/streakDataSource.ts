import { mockHeatmap } from "@selfsketch/ui";
import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { StreakOverviewDto } from "@/data/dto/streak";

/* モック。差し替え手順は baseApi.ts のコメントを参照 */
const MOCK: StreakOverviewDto = {
  current: 12,
  longest: 21,
  monthlyRate: 0.86,
  totalRecords: 148,
  totalDays: 172,
  yearHeatmap: mockHeatmap(26),
  weeklyRates: [0.4, 0.55, 0.7, 0.6, 0.85, 1, 0.75, 0.9, 1, 0.65, 0.95, 0.86],
  nextMilestone: { days: 14, remaining: 2, progress: 12 / 14 },
  badges: [
    { days: 3, glyph: "◆", earned: true },
    { days: 7, glyph: "▲", earned: true },
    { days: 14, glyph: "●", earned: false },
    { days: 30, glyph: "■", earned: false },
    { days: 100, glyph: "★", earned: false },
    { days: 365, glyph: "☾", earned: false },
  ],
};

export const streakDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    streakOverview: build.query<StreakOverviewDto, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: MOCK };
      },
      providesTags: ["Streak"],
    }),
  }),
});
