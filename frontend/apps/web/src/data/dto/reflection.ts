/** `GET /api/v1/reflection/entries` のレスポンス型 */
export interface ReflectionEntryDto {
  kind: "daily" | "comparison" | "timeline" | "century" | "backcast" | "vision";
  /** RFC 3339 / UTC。一度も使っていなければ null */
  lastUsedAt: string | null;
}
