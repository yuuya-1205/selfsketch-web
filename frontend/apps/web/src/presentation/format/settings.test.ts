import { describe, expect, it } from "vitest";
import { daysUntil, formatBytes, storageLabel } from "./settings";

describe("formatBytes", () => {
  it.each([
    [0, "0B"],
    [512, "512B"],
    [1024, "1KB"],
    [420 * 1_048_576, "420MB"],
    [12 * 1_048_576, "12MB"],
    [1_073_741_824, "1GB"],
    [1.5 * 1_073_741_824, "1.5GB"],
  ])("%i バイトは %s", (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected);
  });

  it("負の値でも落ちない", () => {
    expect(formatBytes(-1)).toBe("0B");
  });
});

describe("storageLabel", () => {
  it("使用量と上限を並べる", () => {
    expect(storageLabel(420 * 1_048_576, 1_073_741_824)).toBe("420MB / 1GB");
  });
});

describe("daysUntil", () => {
  // 日をまたいだ回数で数えるので、日付はローカル時刻で組み立てる
  const localDate = (day: number, hours = 0) => new Date(2026, 3, day, hours);

  it("先の日付までの日数を返す", () => {
    expect(daysUntil(localDate(30), localDate(22))).toBe(8);
  });

  it("同じ日は 0", () => {
    expect(daysUntil(localDate(22, 23), localDate(22, 1))).toBe(0);
  });

  it("過ぎていれば 0", () => {
    expect(daysUntil(localDate(20), localDate(22))).toBe(0);
  });
});
