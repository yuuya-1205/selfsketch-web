/** 作品サムネイルの暖色パレット。画像URLが来るまでの代替（.pen と同値） */
const PALETTE = [
  "#e8d9bf",
  "#dcc7a4",
  "#f0e4d0",
  "#cbb491",
  "#e3d2b4",
  "#d4b896",
  "#efe2c9",
  "#c9b28f",
];

export function thumbColor(seed: number) {
  return PALETTE[Math.abs(seed) % PALETTE.length];
}
