import { describe, expect, it } from "vitest";
import { money } from "@/domain/model/money";
import { formatMoney } from "./money";

describe("formatMoney", () => {
  it("円は小数を出さない", () => {
    expect(formatMoney(money(980))).toBe("￥980");
  });

  it("桁区切りを入れる", () => {
    expect(formatMoney(money(9800))).toBe("￥9,800");
  });

  it("0円も出せる", () => {
    expect(formatMoney(money(0))).toBe("￥0");
  });

  it("ドルは最小単位（セント）から小数2桁に戻す", () => {
    expect(formatMoney(money(980, "USD"))).toBe("$9.80");
  });
});
