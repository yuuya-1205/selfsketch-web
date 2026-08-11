/**
 * リフレクションの種類。タイトル・説明・アイコン・行き先は
 * presentation の辞書が持つ（domain は「どれか」だけ知っていればよい）。
 */
export type ReflectionKind =
  "daily" | "comparison" | "timeline" | "century" | "backcast" | "vision";

export interface ReflectionEntry {
  kind: ReflectionKind;
  /** 最後に使った日時。一度も使っていなければ null */
  lastUsedAt: Date | null;
}
