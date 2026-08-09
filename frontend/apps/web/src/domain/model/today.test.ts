import { describe, expect, it } from "vitest";
import {
  completedCount,
  completionRate,
  remainingDays,
  totalCount,
  type FutureSelfSummary,
  type Habit,
  type TodayDashboard,
} from "./today";

function habit(id: string, done: boolean): Habit {
  return {
    id,
    title: id,
    done,
    slot: "morning",
    completedAt: done ? new Date("2026-04-22T07:15:00Z") : null,
    estimatedMinutes: null,
    estimateIsApproximate: false,
  };
}

function dashboard(habits: Habit[]): TodayDashboard {
  return {
    date: new Date("2026-04-22T00:00:00Z"),
    habits,
    streak: { current: 1, longest: 1, week: [], weekStartsOn: "monday" },
    future: {
      title: "1年後の自分",
      targetDate: new Date("2027-03-01T00:00:00Z"),
      progress: 0.34,
      thumbnailUrl: null,
    },
    todayQuote: "",
    weekCompletion: [],
    sketchLogged: false,
  };
}

describe("TodayDashboard の計算", () => {
  it("完了数と総数を数える", () => {
    const d = dashboard([
      habit("a", true),
      habit("b", false),
      habit("c", true),
    ]);
    expect(completedCount(d)).toBe(2);
    expect(totalCount(d)).toBe(3);
  });

  it("達成率は 0–1", () => {
    expect(
      completionRate(dashboard([habit("a", true), habit("b", false)])),
    ).toBe(0.5);
  });

  it("習慣が 0 件でもゼロ除算しない", () => {
    expect(completionRate(dashboard([]))).toBe(0);
  });
});

describe("remainingDays", () => {
  const future = (target: string): FutureSelfSummary => ({
    title: "",
    targetDate: new Date(target),
    progress: 0,
    thumbnailUrl: null,
  });

  it("到達予定日までの日数を切り上げで返す", () => {
    expect(
      remainingDays(
        future("2026-04-25T00:00:00Z"),
        new Date("2026-04-22T00:00:00Z"),
      ),
    ).toBe(3);
  });

  it("端数は切り上げる（今日中に終わらない分は 1日として数える）", () => {
    expect(
      remainingDays(
        future("2026-04-23T06:00:00Z"),
        new Date("2026-04-22T00:00:00Z"),
      ),
    ).toBe(2);
  });

  it("過ぎていたら 0（負の日数を出さない）", () => {
    expect(
      remainingDays(
        future("2026-04-01T00:00:00Z"),
        new Date("2026-04-22T00:00:00Z"),
      ),
    ).toBe(0);
  });
});
