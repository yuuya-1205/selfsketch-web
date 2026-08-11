import { describe, expect, it } from "vitest";
import type { InvoiceDto, UsageMeterDto } from "@/data/dto/billing";
import { toInvoice, toUsageMeter } from "./billing";

const INVOICE: InvoiceDto = {
  id: "in_202604",
  issuedAt: "2026-03-31T15:00:00Z",
  description: "Premium 月額プラン",
  amount: { amount: 980, currency: "JPY" },
  status: "paid",
};

describe("toInvoice", () => {
  it("金額は最小通貨単位の整数のまま持つ", () => {
    expect(toInvoice(INVOICE).amount).toEqual({ amount: 980, currency: "JPY" });
  });

  it("発行日を Date にする", () => {
    expect(toInvoice(INVOICE).issuedAt.toISOString()).toBe(
      "2026-03-31T15:00:00.000Z",
    );
  });

  it("状態は enum のまま持つ（日本語にしない）", () => {
    expect(toInvoice({ ...INVOICE, status: "refunded" }).status).toBe(
      "refunded",
    );
  });
});

describe("toUsageMeter", () => {
  const METER: UsageMeterDto = {
    id: "future_generation",
    used: 3,
    limit: 5,
    resetsAt: "2026-05-01T15:00:00Z",
  };

  it("リセット日時を Date にする", () => {
    expect(toUsageMeter(METER).resetsAt).toBeInstanceOf(Date);
  });

  it("リセットが無ければ null のまま", () => {
    expect(toUsageMeter({ ...METER, resetsAt: null }).resetsAt).toBeNull();
  });

  it("使用量と上限を数のまま持つ（3 / 5 という文字列にしない）", () => {
    const m = toUsageMeter(METER);
    expect(m.used).toBe(3);
    expect(m.limit).toBe(5);
  });
});
