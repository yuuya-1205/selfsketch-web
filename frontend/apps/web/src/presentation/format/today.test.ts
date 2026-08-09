import { describe, expect, it } from "vitest";
import type { Habit } from "@/domain/model/today";
import { dateLabel, habitMetaLabel, timeLabel } from "./today";

function habit(overrides: Partial<Habit>): Habit {
  return {
    id: "h1",
    title: "5分スケッチ",
    done: false,
    slot: "afternoon",
    completedAt: null,
    estimatedMinutes: null,
    estimateIsApproximate: false,
    ...overrides,
  };
}

describe("dateLabel", () => {
  it("月日と曜日を出す", () => {
    expect(dateLabel(new Date(2026, 3, 22))).toBe("4月22日(水)");
  });
});

describe("timeLabel", () => {
  it("分を 2 桁に揃える", () => {
    expect(timeLabel(new Date(2026, 3, 22, 8, 2))).toBe("8:02");
  });

  it("時は 0 詰めしない", () => {
    expect(timeLabel(new Date(2026, 3, 22, 7, 15))).toBe("7:15");
  });
});

describe("habitMetaLabel", () => {
  it("完了なら時刻を出す", () => {
    const h = habit({ done: true, completedAt: new Date(2026, 3, 22, 7, 15) });
    expect(habitMetaLabel(h)).toBe("完了済 · 7:15");
  });

  it("未完了なら時間帯と目安を出す", () => {
    expect(habitMetaLabel(habit({ estimatedMinutes: 3 }))).toBe("午後 · 3分");
  });

  it("概算なら「ほど」を付ける", () => {
    const h = habit({ estimatedMinutes: 10, estimateIsApproximate: true });
    expect(habitMetaLabel(h)).toBe("午後 · 10分ほど");
  });

  it("目安が無ければ時間帯だけ", () => {
    expect(habitMetaLabel(habit({ slot: "before_sleep" }))).toBe("就寝前");
  });

  it("done でも完了時刻が無ければ未完了扱いにする（表示が崩れないように）", () => {
    expect(habitMetaLabel(habit({ done: true, estimatedMinutes: 5 }))).toBe(
      "午後 · 5分",
    );
  });
});
