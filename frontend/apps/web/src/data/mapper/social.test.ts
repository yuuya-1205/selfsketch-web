import { describe, expect, it } from "vitest";
import type { FriendActivityDto, FriendListDto } from "@/data/dto/social";
import { toFriendActivity, toFriendList } from "./social";

const ACTIVITY: FriendActivityDto = {
  id: "f1",
  friend: { id: "u_mio", name: "みお" },
  message: "14日連続を達成しました",
  occurredAt: "2026-04-22T01:00:00Z",
  cheers: 12,
  sharedWorkCount: 1,
};

const LIST: FriendListDto = {
  data: [
    { id: "u_mio", name: "みお", currentStreak: 14 },
    { id: "u_yui", name: "ゆい", currentStreak: 1 },
  ],
  totalCount: 8,
};

describe("toFriendActivity", () => {
  it("発生日時を Date にする", () => {
    const a = toFriendActivity(ACTIVITY);
    expect(a.occurredAt).toBeInstanceOf(Date);
    expect(a.occurredAt.toISOString()).toBe("2026-04-22T01:00:00.000Z");
  });

  it("誰の活動かを id ごと持つ（名前だけにしない）", () => {
    expect(toFriendActivity(ACTIVITY).friend).toEqual({
      id: "u_mio",
      name: "みお",
    });
  });

  it("共有点数は数のまま持つ", () => {
    expect(toFriendActivity(ACTIVITY).sharedWorkCount).toBe(1);
    expect(
      toFriendActivity({ ...ACTIVITY, sharedWorkCount: 0 }).sharedWorkCount,
    ).toBe(0);
  });
});

describe("toFriendList", () => {
  it("一覧と全体の人数を分けて持つ", () => {
    const list = toFriendList(LIST);
    expect(list.items).toHaveLength(2);
    expect(list.totalCount).toBe(8);
  });

  it("連続日数は数のまま持つ（14日連続 という文字列にしない）", () => {
    expect(toFriendList(LIST).items[0].currentStreak).toBe(14);
  });
});
