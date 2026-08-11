import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { FriendActivityDto, FriendListDto } from "@/data/dto/social";

/* ------------------------------------------------------------------ *
 * モック。差し替え手順は baseApi.ts のコメントを参照。
 *   GET  /api/v1/friends
 *   GET  /api/v1/friends/activities
 *   POST /api/v1/friends/activities/:id/cheers
 *
 * 日時は実 API と同じ RFC 3339。ただし「2時間前」の表示は閲覧時刻で決まるので、
 * 固定日付にするとデモが常に「何か月も前」になる。実行時刻からの相対で組み立てる。
 * ------------------------------------------------------------------ */

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

const FRIENDS: FriendListDto = {
  data: [
    { id: "u_mio", name: "みお", currentStreak: 14 },
    { id: "u_kenta", name: "けんた", currentStreak: 30 },
    { id: "u_sayaka", name: "さやか", currentStreak: 6 },
    { id: "u_yui", name: "ゆい", currentStreak: 1 },
  ],
  // 一覧に出しているのは先頭 4 人だけ
  totalCount: 8,
};

let feed: FriendActivityDto[] = [
  {
    id: "f1",
    friend: { id: "u_mio", name: "みお" },
    message: "14日連続を達成しました",
    occurredAt: hoursAgo(2),
    cheers: 12,
    sharedWorkCount: 1,
  },
  {
    id: "f2",
    friend: { id: "u_kenta", name: "けんた" },
    message: "朝のランを 30日継続",
    occurredAt: hoursAgo(4),
    cheers: 8,
    sharedWorkCount: 0,
  },
  {
    id: "f3",
    friend: { id: "u_sayaka", name: "さやか" },
    message: "「読書メモ」を公開しました",
    occurredAt: hoursAgo(6),
    cheers: 3,
    sharedWorkCount: 0,
  },
  {
    id: "f4",
    friend: { id: "u_yui", name: "ゆい" },
    message: "3か月ぶりに再開しました",
    occurredAt: hoursAgo(27),
    cheers: 24,
    sharedWorkCount: 2,
  },
];

/* ------------------------------------------------------------------ */

export const socialDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    friendFeed: build.query<FriendActivityDto[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: structuredClone(feed) };
      },
      providesTags: [{ type: "Social", id: "feed" }],
    }),

    friends: build.query<FriendListDto, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: structuredClone(FRIENDS) };
      },
      providesTags: [{ type: "Social", id: "friends" }],
    }),

    cheer: build.mutation<void, { activityId: string }>({
      queryFn: async ({ activityId }) => {
        await mockDelay();
        feed = feed.map((a) =>
          a.id === activityId ? { ...a, cheers: a.cheers + 1 } : a,
        );
        return { data: undefined };
      },
      // 数字はすぐ動かす。失敗したら巻き戻す
      onQueryStarted: async ({ activityId }, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          socialDataSource.util.updateQueryData(
            "friendFeed",
            undefined,
            (draft) => {
              const activity = draft.find((a) => a.id === activityId);
              if (activity) activity.cheers += 1;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});
