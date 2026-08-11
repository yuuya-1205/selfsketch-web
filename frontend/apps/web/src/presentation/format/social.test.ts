import { describe, expect, it } from "vitest";
import {
  nameInitial,
  relativeTimeLabel,
  sharedWorkLabel,
  streakLabel,
} from "./social";

/*
 * 相対表示は閲覧者のローカル時刻が基準。
 * ISO 文字列で書くと実行環境のタイムゾーンで結果が変わるので、
 * 日時は必ず new Date(年, 月, 日, ...) で組み立てる。
 */
function localDate(day: number, hours = 0, minutes = 0): Date {
  return new Date(2026, 3, day, hours, minutes);
}

const NOW = localDate(22, 10, 0);

describe("relativeTimeLabel", () => {
  it.each([
    [localDate(22, 9, 59), "1分前"],
    [localDate(22, 9, 30), "30分前"],
    [localDate(22, 8, 0), "2時間前"],
    [localDate(22, 0, 30), "9時間前"],
    [localDate(21, 23, 0), "昨日"],
    [localDate(20, 9, 0), "2日前"],
    [localDate(16, 9, 0), "6日前"],
  ])("%s は %s", (occurredAt, expected) => {
    expect(relativeTimeLabel(occurredAt, NOW)).toBe(expected);
  });

  it("1分未満は「たった今」", () => {
    const justNow = new Date(NOW.getTime() - 30_000);
    expect(relativeTimeLabel(justNow, NOW)).toBe("たった今");
  });

  it("7日以上前は日付にする", () => {
    expect(relativeTimeLabel(localDate(15, 9, 0), NOW)).toBe("4/15");
  });

  it("日をまたいだら経過時間が短くても「昨日」", () => {
    // 前日23時 → 当日1時。2時間しか経っていないが日はまたいでいる
    expect(relativeTimeLabel(localDate(21, 23, 0), localDate(22, 1, 0))).toBe(
      "昨日",
    );
  });
});

describe("nameInitial", () => {
  it("先頭の1文字を返す", () => {
    expect(nameInitial("みお")).toBe("み");
  });

  it("サロゲートペアで壊れない", () => {
    expect(nameInitial("𩸽さん")).toBe("𩸽");
  });

  it("空の名前でも落ちない", () => {
    expect(nameInitial("")).toBe("");
  });
});

describe("streakLabel", () => {
  it.each([
    [0, "1日目"],
    [1, "1日目"],
    [2, "2日連続"],
    [14, "14日連続"],
  ])("%i 日は %s", (days, expected) => {
    expect(streakLabel(days)).toBe(expected);
  });
});

describe("sharedWorkLabel", () => {
  it("0件なら出さない", () => {
    expect(sharedWorkLabel(0)).toBeNull();
  });

  it("件数を入れる", () => {
    expect(sharedWorkLabel(2)).toBe("作品を2点シェア");
  });
});
