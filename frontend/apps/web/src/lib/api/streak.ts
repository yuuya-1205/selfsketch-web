import { mockHeatmap } from "@selfsketch/ui";
import { baseApi, mockDelay } from "./baseApi";
import type { StreakPage } from "./types";

const STREAK: StreakPage = {
  current: 12,
  longest: 21,
  monthlyRate: 0.86,
  totalRecords: 148,
  totalDays: 172,
  yearHeatmap: mockHeatmap(26),
  weeklyRates: [0.4, 0.55, 0.7, 0.6, 0.85, 1, 0.75, 0.9, 1, 0.65, 0.95, 0.86],
  nextMilestone: { label: "14日連続", remaining: 2, progress: 12 / 14 },
  badges: [
    { label: "3日", glyph: "◆", earned: true },
    { label: "7日", glyph: "▲", earned: true },
    { label: "14日", glyph: "●", earned: false },
    { label: "30日", glyph: "■", earned: false },
    { label: "100日", glyph: "★", earned: false },
    { label: "365日", glyph: "☾", earned: false },
  ],
};

export const streakApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    streak: build.query<StreakPage, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: STREAK };
      },
      providesTags: ["Streak"],
    }),
  }),
});

export const { useStreakQuery } = streakApi;
