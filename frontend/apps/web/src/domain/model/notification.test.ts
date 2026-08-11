import { describe, expect, it } from "vitest";
import {
  bucketOf,
  groupByRecency,
  unreadCount,
  type Notification,
} from "./notification";

const NOW = new Date("2026-04-22T10:00:00+09:00");

function at(iso: string, read = false): Notification {
  return {
    id: iso,
    title: "お知らせ",
    category: "reminder",
    receivedAt: new Date(iso),
    read,
  };
}

describe("bucketOf", () => {
  it.each([
    ["2026-04-22T07:00:00+09:00", "today"],
    ["2026-04-22T00:05:00+09:00", "today"],
    ["2026-04-21T23:55:00+09:00", "this_week"],
    ["2026-04-16T09:00:00+09:00", "this_week"],
    ["2026-04-15T09:00:00+09:00", "earlier"],
  ])("%s は %s", (iso, expected) => {
    expect(bucketOf(at(iso), NOW)).toBe(expected);
  });

  it("日付の境目は時刻ではなく日で切る", () => {
    // 15時間前でも日をまたいでいれば「今日」ではない
    expect(bucketOf(at("2026-04-21T19:00:00+09:00"), NOW)).toBe("this_week");
    // 10時間前で同じ日なら「今日」
    expect(bucketOf(at("2026-04-22T00:30:00+09:00"), NOW)).toBe("today");
  });
});

describe("groupByRecency", () => {
  it("新しい順に並べてから振り分ける", () => {
    const groups = groupByRecency(
      [
        at("2026-04-16T09:00:00+09:00"),
        at("2026-04-22T07:00:00+09:00"),
        at("2026-04-22T12:00:00+09:00"),
      ],
      NOW,
    );

    expect(groups.map((g) => g.bucket)).toEqual(["today", "this_week"]);
    expect(groups[0].items.map((i) => i.id)).toEqual([
      "2026-04-22T12:00:00+09:00",
      "2026-04-22T07:00:00+09:00",
    ]);
  });

  it("空のグループは出さない", () => {
    const groups = groupByRecency([at("2026-04-22T07:00:00+09:00")], NOW);
    expect(groups).toHaveLength(1);
    expect(groups[0].bucket).toBe("today");
  });

  it("1件も無ければ空配列", () => {
    expect(groupByRecency([], NOW)).toEqual([]);
  });

  it("元の配列を書き換えない", () => {
    const items = [
      at("2026-04-16T09:00:00+09:00"),
      at("2026-04-22T07:00:00+09:00"),
    ];
    const before = items.map((i) => i.id);
    groupByRecency(items, NOW);
    expect(items.map((i) => i.id)).toEqual(before);
  });
});

describe("unreadCount", () => {
  it("未読だけ数える", () => {
    expect(
      unreadCount([
        at("2026-04-22T07:00:00+09:00", false),
        at("2026-04-22T08:00:00+09:00", true),
        at("2026-04-22T09:00:00+09:00", false),
      ]),
    ).toBe(2);
  });
});
