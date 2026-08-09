import { describe, expect, it } from "vitest";
import type { HabitDto, TodayDashboardDto } from "@/data/dto/today";
import { toHabit, toTodayDashboard } from "./today";

const DONE: HabitDto = {
  id: "h1",
  title: "5分スケッチ",
  done: true,
  slot: "morning",
  completedAt: "2026-04-21T22:15:00Z",
  estimatedMinutes: 5,
  estimateIsApproximate: false,
};

const UNDONE: HabitDto = {
  id: "h4",
  title: "好きな絵を1枚見る",
  done: false,
  slot: "afternoon",
  completedAt: null,
  estimatedMinutes: 10,
  estimateIsApproximate: true,
};

describe("toHabit", () => {
  it("completedAt を Date にする", () => {
    const h = toHabit(DONE);
    expect(h.completedAt).toBeInstanceOf(Date);
    // UTC の 22:15 は JST の翌 7:15。Date が UTC として解釈できていることを押さえる
    expect(h.completedAt?.toISOString()).toBe("2026-04-21T22:15:00.000Z");
  });

  it("未完了は completedAt を null のままにする", () => {
    expect(toHabit(UNDONE).completedAt).toBeNull();
  });

  it("slot はサーバの値をそのまま持つ（表示ラベルに変換しない）", () => {
    expect(toHabit(UNDONE).slot).toBe("afternoon");
  });

  it("目安が概算かどうかを落とさない", () => {
    expect(toHabit(UNDONE).estimateIsApproximate).toBe(true);
    expect(toHabit(DONE).estimateIsApproximate).toBe(false);
  });
});

describe("toTodayDashboard", () => {
  const dto: TodayDashboardDto = {
    date: "2026-04-22T00:00:00Z",
    habits: [DONE, UNDONE],
    streak: {
      current: 12,
      longest: 21,
      week: [true, true, false],
      weekStartsOn: "monday",
    },
    future: {
      title: "1年後の自分",
      targetDate: "2027-02-28T00:00:00Z",
      progress: 0.34,
      thumbnailUrl: null,
    },
    todayQuote: "「うまく描けない日も、線は残る。」",
    weekCompletion: [0.6, 1],
    sketchLogged: false,
  };

  it("日時をすべて Date にする", () => {
    const d = toTodayDashboard(dto);
    expect(d.date).toBeInstanceOf(Date);
    expect(d.future.targetDate).toBeInstanceOf(Date);
    expect(d.habits[0].completedAt).toBeInstanceOf(Date);
  });

  it("週の起点を落とさない", () => {
    expect(toTodayDashboard(dto).streak.weekStartsOn).toBe("monday");
  });

  it("残りのフィールドはそのまま写す", () => {
    const d = toTodayDashboard(dto);
    expect(d.todayQuote).toBe(dto.todayQuote);
    expect(d.weekCompletion).toEqual([0.6, 1]);
    expect(d.sketchLogged).toBe(false);
    expect(d.habits).toHaveLength(2);
  });
});
