import type { NotificationsRepository } from "@/domain/repository/notificationsRepository";
import { notificationsDataSource } from "@/data/datasource/notificationsDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toNotifications } from "@/data/mapper/notification";

export const notificationsRepository: NotificationsRepository = {
  useNotifications() {
    const { data, isLoading, error, refetch } =
      notificationsDataSource.useNotificationsQuery();
    return {
      data: data && toNotifications(data),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },

  useMarkAllRead() {
    const [markAllRead] =
      notificationsDataSource.useMarkAllNotificationsReadMutation();
    return async () => {
      await markAllRead().unwrap();
    };
  },
};
