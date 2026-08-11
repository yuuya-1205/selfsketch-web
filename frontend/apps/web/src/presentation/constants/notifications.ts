import {
  Bell,
  Flame,
  Heart,
  Moon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type {
  NotificationBucket,
  NotificationCategory,
} from "@/domain/model/notification";
import type { NotificationFilter } from "@/usecase/notifications";

/** 種類ごとの表示ラベル。domain は英小文字の enum しか持たない */
export const CATEGORY_LABEL: Record<NotificationCategory, string> = {
  reminder: "リマインド",
  achievement: "達成",
  friend: "フレンド",
  insight: "インサイト",
  future: "未来",
};

export const CATEGORY_ICON: Record<NotificationCategory, LucideIcon> = {
  reminder: Bell,
  achievement: Flame,
  friend: Heart,
  insight: Sparkles,
  future: Moon,
};

export const BUCKET_LABEL: Record<NotificationBucket, string> = {
  today: "今日",
  this_week: "今週",
  earlier: "それ以前",
};

/** 絞り込みのタブ。.pen の並びに合わせる */
export const NOTIFICATION_FILTERS: {
  label: string;
  value: NotificationFilter;
}[] = [
  { label: "すべて", value: null },
  { label: CATEGORY_LABEL.reminder, value: "reminder" },
  { label: CATEGORY_LABEL.friend, value: "friend" },
  { label: CATEGORY_LABEL.achievement, value: "achievement" },
];

export const NOTIFICATION_CHANNELS = [
  { label: "ブラウザ通知 (Web)", enabled: true },
  { label: "メール", enabled: true },
  { label: "モバイルプッシュ", enabled: true },
  { label: "週次サマリー", enabled: false },
];
