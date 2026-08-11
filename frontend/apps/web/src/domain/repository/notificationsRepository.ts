import type { Notification } from "@/domain/model/notification";
import type { RepositoryResult } from "./result";

export interface NotificationsRepository {
  useNotifications(): RepositoryResult<Notification[]>;
  /** すべて既読にする */
  useMarkAllRead(): () => Promise<void>;
}
