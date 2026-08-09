import { baseApi, mockDelay } from "./baseApi";
import type { NotificationGroup } from "./types";

const GROUPS: NotificationGroup[] = [
  {
    label: "今日",
    items: [
      {
        id: "n1",
        icon: "bell",
        title: "今日の5分スケッチの時間です",
        category: "リマインド",
        time: "7:00",
        unread: true,
      },
      {
        id: "n2",
        icon: "flame",
        title: "14日連続を達成しました",
        category: "達成",
        time: "8:12",
        unread: true,
      },
      {
        id: "n3",
        icon: "heart",
        title: "みおさんがあなたの作品をはげましました",
        category: "フレンド",
        time: "10:30",
        unread: true,
      },
      {
        id: "n4",
        icon: "sparkles",
        title: "4月のレポートができました",
        category: "インサイト",
        time: "12:00",
        unread: true,
      },
    ],
  },
  {
    label: "今週",
    items: [
      {
        id: "n5",
        icon: "users",
        title: "けんたさんがフレンドになりました",
        category: "フレンド",
        time: "4/21",
        unread: false,
      },
      {
        id: "n6",
        icon: "moon",
        title: "1年後の自分から手紙が届いています",
        category: "未来",
        time: "4/20",
        unread: false,
      },
      {
        id: "n7",
        icon: "bell",
        title: "夜のリフレクションが3日空いています",
        category: "リマインド",
        time: "4/19",
        unread: false,
      },
    ],
  },
];

export const NOTIFICATION_FILTERS = [
  "すべて",
  "リマインド",
  "フレンド",
  "達成",
] as const;

export const NOTIFICATION_CHANNELS = [
  { label: "ブラウザ通知 (Web)", enabled: true },
  { label: "メール", enabled: true },
  { label: "モバイルプッシュ", enabled: true },
  { label: "週次サマリー", enabled: false },
];

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    notifications: build.query<typeof GROUPS, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: GROUPS };
      },
      providesTags: ["Notification"],
    }),
  }),
});

export const { useNotificationsQuery } = notificationsApi;
