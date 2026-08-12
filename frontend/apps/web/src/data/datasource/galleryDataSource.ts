import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { GalleryItemDto, GalleryMonthDto } from "@/data/dto/gallery";

/* モック。差し替え手順は baseApi.ts のコメントを参照 */
const month = (
  month: string,
  count: number,
  note: string | null,
  days: string[],
  seedOffset: number,
): GalleryMonthDto => ({
  month,
  count,
  note,
  items: days.map((day, i) => ({
    id: `${month.slice(0, 7)}-${day}`,
    createdAt: `${day}T00:00:00Z`,
    title: "5分スケッチ",
    imageUrl: null,
    seed: i + seedOffset,
  })),
});

const MONTHS: GalleryMonthDto[] = [
  month(
    "2026-04-01T00:00:00Z",
    12,
    null,
    ["2026-04-22", "2026-04-20", "2026-04-18", "2026-04-15", "2026-04-12"],
    0,
  ),
  month(
    "2026-03-01T00:00:00Z",
    28,
    "達成率 92%",
    ["2026-03-29", "2026-03-26", "2026-03-22", "2026-03-18", "2026-03-14"],
    5,
  ),
  month(
    "2026-02-01T00:00:00Z",
    24,
    "初めての作品集",
    ["2026-02-27", "2026-02-22", "2026-02-16", "2026-02-09", "2026-02-03"],
    10,
  ),
];

const GRID: GalleryItemDto[] = Array.from({ length: 24 }, (_, i) => ({
  id: `g-${i}`,
  createdAt: `2026-04-${String(22 - i).padStart(2, "0")}T00:00:00Z`,
  title: i === 0 ? "線が迷わなくなってきた" : "5分スケッチ",
  imageUrl: null,
  seed: i * 3 + 3,
}));

export const galleryDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    galleryMonths: build.query<GalleryMonthDto[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: MONTHS };
      },
      providesTags: ["Gallery"],
    }),

    galleryGrid: build.query<GalleryItemDto[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: GRID };
      },
      providesTags: (result) => [
        "Gallery",
        ...(result ?? []).map((i) => ({ type: "Gallery" as const, id: i.id })),
      ],
    }),
  }),
});
