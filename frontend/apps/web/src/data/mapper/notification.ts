import type { Notification } from "@/domain/model/notification";
import type { NotificationDto } from "@/data/dto/notification";

export function toNotification(dto: NotificationDto): Notification {
  return {
    id: dto.id,
    title: dto.title,
    category: dto.category,
    receivedAt: new Date(dto.receivedAt),
    read: dto.read,
  };
}

export function toNotifications(dtos: NotificationDto[]): Notification[] {
  return dtos.map(toNotification);
}
