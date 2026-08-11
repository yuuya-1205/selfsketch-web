import { describe, expect, it } from "vitest";
import { lastUsedLabel } from "./reflection";

// 日をまたいだ回数で数えるので、日時はローカル時刻で組み立てる
function localDate(day: number, hours = 12, minutes = 0): Date {
  return new Date(2026, 3, day, hours, minutes);
}

const NOW = localDate(22, 10, 0);

describe("lastUsedLabel", () => {
  it("一度も使っていなければ「未実施」", () => {
    expect(lastUsedLabel(null, NOW)).toBe("未実施");
  });

  it("同じ日なら時刻まで出す", () => {
    expect(lastUsedLabel(localDate(22, 7, 5), NOW)).toBe("今日 7:05");
  });

  it("前日なら「昨日」と時刻", () => {
    expect(lastUsedLabel(localDate(21, 22, 14), NOW)).toBe("昨日 22:14");
  });

  it.each([
    [localDate(19), "3日前"],
    [localDate(16), "6日前"],
    [localDate(13), "先週"],
    [localDate(7), "2週間前"],
    [localDate(1), "3週間前"],
  ])("%s は %s", (lastUsedAt, expected) => {
    expect(lastUsedLabel(lastUsedAt, NOW)).toBe(expected);
  });

  it("30日以上60日未満は「先月」", () => {
    expect(lastUsedLabel(new Date(2026, 2, 15, 12), NOW)).toBe("先月");
  });

  it("60日以上はか月で出す", () => {
    expect(lastUsedLabel(new Date(2026, 0, 15, 12), NOW)).toBe("3か月前");
  });

  it("経過時間ではなく日付の変わり目で切る", () => {
    // 前日23時 → 当日1時。2時間しか経っていないが「昨日」
    expect(lastUsedLabel(localDate(21, 23, 0), localDate(22, 1, 0))).toBe(
      "昨日 23:00",
    );
  });
});
