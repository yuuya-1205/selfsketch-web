/** シェアカードの見た目。`.pen` W-Social 2 のテンプレート選択と 1:1 */
export const SHARE_TEMPLATES = ["ダーク", "ペーパー", "ミニマル"] as const;

export const SHARE_OPTIONS = [
  { label: "作品画像", enabled: true },
  { label: "連続日数", enabled: true },
  { label: "ジャーナル本文", enabled: false },
  { label: "フレンド数", enabled: false },
];
