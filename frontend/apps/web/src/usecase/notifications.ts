import {
  groupByRecency,
  unreadCount,
  type NotificationCategory,
} from "@/domain/model/notification";
import { useRepositories } from "@/presentation/di/repositories";

/** 絞り込みの選択肢。「すべて」は null で表す */
export type NotificationFilter = NotificationCategory | null;

/**
 * 通知一覧。絞り込みと「今日 / 今週 / それ以前」の振り分けをここで行う。
 * どこで区切るかは閲覧時刻で決まるので、サーバの返り値には含まれない。
 */
export function useNotifications(filter: NotificationFilter) {
  const { data, isLoading, error, retry } =
    useRepositories().notifications.useNotifications();

  const all = data ?? [];
  const visible = filter ? all.filter((n) => n.category === filter) : all;

  return {
    groups: data ? groupByRecency(visible, new Date()) : undefined,
    // 未読数は絞り込みに関わらず全体の数を出す
    unreadCount: unreadCount(all),
    isLoading,
    error,
    retry,
  };
}

export function useMarkAllNotificationsRead() {
  return useRepositories().notifications.useMarkAllRead();
}
