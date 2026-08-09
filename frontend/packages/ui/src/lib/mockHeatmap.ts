/** 決定的な擬似ヒートマップ生成（モック用） */
export function mockHeatmap(weekCount: number, seed = 3): number[][] {
  return Array.from({ length: weekCount }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => (w * seed + d * 2 + (w % 4)) % 5),
  );
}
