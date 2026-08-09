import { describe, expect, it } from "vitest";
import { daysToBest, earnedBadgeCount, type StreakOverview } from "./streak";

function streak(overrides: Partial<StreakOverview>): StreakOverview {
  return {
    current: 12,
    longest: 21,
    monthlyRate: 0.86,
    totalRecords: 148,
    totalDays: 172,
    yearHeatmap: [],
    weeklyRates: [],
    nextMilestone: { days: 14, remaining: 2, progress: 12 / 14 },
    badges: [],
    ...overrides,
  };
}

describe("daysToBest", () => {
  it("自己ベストまでの日数を返す", () => {
    expect(daysToBest(streak({ current: 12, longest: 21 }))).toBe(9);
  });

  it("更新中なら 0（負の日数を出さない）", () => {
    expect(daysToBest(streak({ current: 30, longest: 21 }))).toBe(0);
  });
});

describe("earnedBadgeCount", () => {
  it("獲得済みの数を数える", () => {
    const s = streak({
      badges: [
        { days: 3, glyph: "◆", earned: true },
        { days: 7, glyph: "▲", earned: true },
        { days: 14, glyph: "●", earned: false },
      ],
    });
    expect(earnedBadgeCount(s)).toBe(2);
  });
});
