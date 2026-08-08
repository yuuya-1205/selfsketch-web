import { useMockQuery } from "./client";
import type { GalleryItem, GalleryMonth } from "./types";

const MONTHS: GalleryMonth[] = [
  {
    label: "2026年 4月",
    summary: "12点 · 今月",
    items: ["4/22", "4/20", "4/18", "4/15", "4/12"].map((d, i) => ({
      id: `a-${d}`,
      dateLabel: d,
      title: "5分スケッチ",
      seed: i,
    })),
  },
  {
    label: "2026年 3月",
    summary: "28点 · 達成率 92%",
    items: ["3/29", "3/26", "3/22", "3/18", "3/14"].map((d, i) => ({
      id: `b-${d}`,
      dateLabel: d,
      title: "5分スケッチ",
      seed: i + 5,
    })),
  },
  {
    label: "2026年 2月",
    summary: "24点 · 初めての作品集",
    items: ["2/27", "2/22", "2/16", "2/09", "2/03"].map((d, i) => ({
      id: `c-${d}`,
      dateLabel: d,
      title: "5分スケッチ",
      seed: i + 10,
    })),
  },
];

const GRID: GalleryItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `g-${i}`,
  dateLabel: `4/${String(22 - i).padStart(2, "0")}`,
  title: i === 0 ? "線が迷わなくなってきた" : "5分スケッチ",
  seed: i * 3 + 3,
}));

export function useGalleryMonths() {
  return useMockQuery(["gallery", "timeline"], MONTHS);
}

export function useGalleryGrid() {
  return useMockQuery(["gallery", "grid"], GRID);
}

export function useGalleryItem(id: string | undefined) {
  const items = useGalleryGrid();
  return items.find((i) => i.id === id) ?? items[0];
}
