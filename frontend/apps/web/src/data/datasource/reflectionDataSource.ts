import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { ReflectionEntryDto } from "@/data/dto/reflection";

/* ------------------------------------------------------------------ *
 * モック。差し替え手順は baseApi.ts のコメントを参照。
 *   GET /api/v1/reflection/entries
 *
 * 「昨日 22:14」「3日前」の表示は閲覧時刻で決まるので、
 * 固定日付にするとデモが常に「何か月も前」になる。実行時刻からの相対で組み立てる。
 * ------------------------------------------------------------------ */

function daysAgo(days: number, hours = 12, minutes = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

const MOCK: ReflectionEntryDto[] = [
  { kind: "daily", lastUsedAt: daysAgo(1, 22, 14) },
  { kind: "comparison", lastUsedAt: daysAgo(3) },
  { kind: "timeline", lastUsedAt: daysAgo(9) },
  { kind: "century", lastUsedAt: null },
  { kind: "backcast", lastUsedAt: daysAgo(15) },
  { kind: "vision", lastUsedAt: daysAgo(38) },
];

/* ------------------------------------------------------------------ */

export const reflectionDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    reflectionEntries: build.query<ReflectionEntryDto[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: MOCK.map((e) => ({ ...e })) };
      },
      providesTags: ["Reflection"],
    }),
  }),
});
