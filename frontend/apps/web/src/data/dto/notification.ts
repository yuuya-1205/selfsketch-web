/** `GET /api/v1/notifications` のレスポンス型 */
export type NotificationCategoryDto =
  "reminder" | "achievement" | "friend" | "insight" | "future";

export interface NotificationDto {
  id: string;
  title: string;
  category: NotificationCategoryDto;
  /** RFC 3339 / UTC */
  receivedAt: string;
  read: boolean;
}
