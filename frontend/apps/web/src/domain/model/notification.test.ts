import { describe, expect, it } from "vitest";
import {
  bucketOf,
  groupByRecency,
  unreadCount,
  type Notification,
} from "./notification";

/*
 * 「今日」は閲覧者のローカル時刻の日で切る。
 * そのため日時は必ず new Date(年, 月, 日, 時, 分) で組み立てる
 * （ISO 文字列は UTC 基準に解釈されるので、実行環境のタイムゾーンで結果が変わる）。
 */
function localDate(day: number, hours = 0, minutes = 0): Date {
  return new Date(2026, 3, day, hours, minutes);
}

const NOW = localDate(22, 10, 0);

function notification(receivedAt: Date, read = false): Notification {
  return {
    id: receivedAt.toISOString(),
    title: "お知らせ",
    category: "reminder",
    receivedAt,
    read,
  };
}

describe("bucketOf", () => {
  it.each([
    [localDate(22, 7, 0), "today", "同じ日の朝"],
    [localDate(22, 0, 5), "today", "同じ日の未明"],
    [localDate(21, 23, 55), "this_week", "前日の深夜"],
    [localDate(16, 9, 0), "this_week", "6日前"],
    [localDate(15, 9, 0), "earlier", "7日前"],
  ])("%s は %s（%s）", (receivedAt, expected) => {
    expect(bucketOf(notification(receivedAt), NOW)).toBe(expected);
  });

  it("経過時間ではなく日付の変わり目で切る", () => {
    // 15時間前でも日をまたいでいれば「今日」ではない
    expect(bucketOf(notification(localDate(21, 19, 0)), NOW)).toBe("this_week");
    // 10時間前で同じ日なら「今日」
    expect(bucketOf(notification(localDate(22, 0, 30)), NOW)).toBe("today");
  });
});

describe("groupByRecency", () => {
  it("新しい順に並べてから振り分ける", () => {
    const groups = groupByRecency(
      [
        notification(localDate(16, 9, 0)),
        notification(localDate(22, 7, 0)),
        notification(localDate(22, 12, 0)),
      ],
      NOW,
    );

    expect(groups.map((g) => g.bucket)).toEqual(["today", "this_week"]);
    expect(groups[0].items.map((i) => i.receivedAt.getHours())).toEqual([
      12, 7,
    ]);
  });

  it("空のグループは出さない", () => {
    const groups = groupByRecency([notification(localDate(22, 7, 0))], NOW);
    expect(groups).toHaveLength(1);
    expect(groups[0].bucket).toBe("today");
  });

  it("1件も無ければ空配列", () => {
    expect(groupByRecency([], NOW)).toEqual([]);
  });

  it("元の配列を書き換えない", () => {
    const items = [
      notification(localDate(16, 9, 0)),
      notification(localDate(22, 7, 0)),
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
        notification(localDate(22, 7, 0), false),
        notification(localDate(22, 8, 0), true),
        notification(localDate(22, 9, 0), false),
      ]),
    ).toBe(2);
  });
});
