import { describe, expect, it } from "vitest";
import type { HabitDetailDto } from "@/data/dto/habit";
import { toHabitDetail } from "./habit";

const DTO: HabitDetailDto = {
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
  heatmap: [[0, 1]],
  notes: [{ date: "2026-04-21T15:00:00Z", body: "線が迷わなくなってきた。" }],
};

describe("toHabitDetail", () => {
  it("開始日とメモの日付を Date にする", () => {
    const h = toHabitDetail(DTO);
    expect(h.startedAt).toBeInstanceOf(Date);
    expect(h.notes[0].date).toBeInstanceOf(Date);
    expect(h.startedAt.toISOString()).toBe("2025-11-01T15:00:00.000Z");
  });

  it("紐づけたビジョンは id ごと持つ（表示名だけにしない）", () => {
    expect(toHabitDetail(DTO).linkedVision).toEqual({
      id: "v1",
      title: "1年後の自分",
    });
  });

  it("ビジョン未設定は null のまま", () => {
    expect(
      toHabitDetail({ ...DTO, linkedVision: null }).linkedVision,
    ).toBeNull();
  });

  it("予定時刻が無くても落ちない", () => {
    expect(
      toHabitDetail({ ...DTO, scheduledTime: null }).scheduledTime,
    ).toBeNull();
  });
});
