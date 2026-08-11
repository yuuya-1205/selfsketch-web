import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { InvoiceDto, UsageMeterDto } from "@/data/dto/billing";

/* ------------------------------------------------------------------ *
 * モック。差し替え手順は baseApi.ts のコメントを参照。
 *   GET /api/v1/me/subscription
 *
 * 金額は最小通貨単位の整数（¥980 は 980）。表示は presentation で作る。
 * ------------------------------------------------------------------ */

/** 使用量のリセットは実行時刻の 8 日後（デモが常に「期限切れ」にならないように） */
function resetsInDays(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

const USAGE: UsageMeterDto[] = [
  {
    id: "future_generation",
    used: 3,
    limit: 5,
    resetsAt: resetsInDays(8),
  },
  { id: "artwork_storage", used: 42, limit: 100, resetsAt: null },
  { id: "export", used: 0, limit: 1, resetsAt: resetsInDays(8) },
];

const INVOICES: InvoiceDto[] = [
  {
    id: "in_202604",
    issuedAt: "2026-03-31T15:00:00Z",
    description: "Premium 月額プラン",
    amount: { amount: 980, currency: "JPY" },
    status: "paid",
  },
  {
    id: "in_202603",
    issuedAt: "2026-02-28T15:00:00Z",
    description: "Premium 月額プラン",
    amount: { amount: 980, currency: "JPY" },
    status: "paid",
  },
  {
    id: "in_202602",
    issuedAt: "2026-01-31T15:00:00Z",
    description: "Premium 月額プラン",
    amount: { amount: 980, currency: "JPY" },
    status: "refunded",
  },
];

/* ------------------------------------------------------------------ */

export const billingDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    usage: build.query<UsageMeterDto[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: structuredClone(USAGE) };
      },
      providesTags: [{ type: "Settings", id: "usage" }],
    }),

    invoices: build.query<InvoiceDto[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: structuredClone(INVOICES) };
      },
      providesTags: [{ type: "Settings", id: "invoices" }],
    }),
  }),
});
