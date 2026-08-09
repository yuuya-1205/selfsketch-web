/** `GET /api/v1/gallery/*` のレスポンス型 */
export interface GalleryItemDto {
  id: string;
  /** RFC 3339 / UTC */
  createdAt: string;
  title: string;
  seed: number;
}

export interface GalleryMonthDto {
  /** RFC 3339 / UTC。その月の 1日 */
  month: string;
  count: number;
  note: string | null;
  items: GalleryItemDto[];
}
