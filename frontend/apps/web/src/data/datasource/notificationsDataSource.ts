import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { NotificationDto } from "@/data/dto/notification";

/* ------------------------------------------------------------------ *
 * モック。差し替え手順は baseApi.ts のコメントを参照。
 *   GET   /api/v1/notifications
 *   PATCH /api/v1/notifications/read-all
 *
 * 日時は実 API と同じ RFC 3339 で返す。ただし「今日 / 今週」の区切りは
 * 閲覧時刻で決まるので、固定日付にするとデモが常に「それ以前」に落ちる。
 * そのため実行時刻からの相対で組み立てている。
 * ------------------------------------------------------------------ */

/** その日の時刻を指す RFC 3339 文字列。daysAgo 日前 */
function at(daysAgo: number, hours: number, minutes: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function buildMock(): NotificationDto[] {
  return [
    {
      id: "n1",
      title: "今日の5分スケッチの時間です",
      category: "reminder",
      receivedAt: at(0, 7, 0),
      read: false,
    },
    {
      id: "n2",
      title: "14日連続を達成しました",
      category: "achievement",
      receivedAt: at(0, 8, 12),
      read: false,
    },
    {
      id: "n3",
      title: "みおさんがあなたの作品をはげましました",
      category: "friend",
      receivedAt: at(0, 10, 30),
      read: false,
    },
    {
      id: "n4",
      title: "4月のレポートができました",
      category: "insight",
      receivedAt: at(0, 12, 0),
      read: false,
    },
    {
      id: "n5",
      title: "けんたさんがフレンドになりました",
      category: "friend",
      receivedAt: at(1, 15, 40),
      read: true,
    },
    {
      id: "n6",
      title: "1年後の自分から手紙が届いています",
      category: "future",
      receivedAt: at(2, 9, 5),
      read: true,
    },
    {
      id: "n7",
      title: "夜のリフレクションが3日空いています",
      category: "reminder",
      receivedAt: at(3, 21, 30),
      read: true,
    },
    {
      id: "n8",
      title: "3月のレポートができました",
      category: "insight",
      receivedAt: at(21, 12, 0),
      read: true,
    },
  ];
}

let mock = buildMock();

/* ------------------------------------------------------------------ */

export const notificationsDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    notifications: build.query<NotificationDto[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: structuredClone(mock) };
      },
      providesTags: ["Notification"],
    }),

    markAllNotificationsRead: build.mutation<void, void>({
      queryFn: async () => {
        await mockDelay();
        mock = mock.map((n) => ({ ...n, read: true }));
        return { data: undefined };
      },
      invalidatesTags: ["Notification"],
    }),
  }),
});
