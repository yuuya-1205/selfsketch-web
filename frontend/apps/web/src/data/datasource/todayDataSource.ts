import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { TodayDashboardDto } from "@/data/dto/today";

/* ------------------------------------------------------------------ *
 * モック。差し替え手順は baseApi.ts のコメントを参照。
 * 値はサーバが返す形（RFC 3339 / UTC）で持つ。
 * ------------------------------------------------------------------ */

const MOCK: TodayDashboardDto = {
  date: "2026-04-21T15:00:00Z",
  habits: [
    {
      id: "h1",
      title: "5分スケッチ",
      done: true,
      slot: "morning",
      completedAt: "2026-04-21T22:15:00Z",
      estimatedMinutes: 5,
      estimateIsApproximate: false,
    },
    {
      id: "h2",
      title: "朝のストレッチ",
      done: true,
      slot: "after_wake",
      completedAt: "2026-04-21T23:02:00Z",
      estimatedMinutes: 5,
      estimateIsApproximate: false,
    },
    {
      id: "h3",
      title: "1日1ページ読書",
      done: true,
      slot: "noon",
      completedAt: "2026-04-22T03:40:00Z",
      estimatedMinutes: 10,
      estimateIsApproximate: false,
    },
    {
      id: "h4",
      title: "好きな絵を1枚見る",
      done: false,
      slot: "afternoon",
      completedAt: null,
      estimatedMinutes: 10,
      estimateIsApproximate: true,
    },
    {
      id: "h5",
      title: "夜のリフレクション",
      done: false,
      slot: "before_sleep",
      completedAt: null,
      estimatedMinutes: 3,
      estimateIsApproximate: false,
    },
  ],
  streak: {
    current: 12,
    longest: 21,
    week: [true, true, true, true, false, false, false],
    weekStartsOn: "monday",
  },
  future: {
    title: "1年後の自分",
    targetDate: "2027-02-27T15:00:00Z",
    progress: 0.34,
    thumbnailUrl: null,
  },
  todayQuote: "「うまく描けない日も、線は残る。」",
  weekCompletion: [0.6, 1, 0.8, 1, 0.4, 0.2, 0],
  sketchLogged: false,
};

async function fetchTodayDashboard(): Promise<TodayDashboardDto> {
  await mockDelay(120);
  return structuredClone(MOCK);
}

async function toggleHabit(id: string, done: boolean): Promise<void> {
  await mockDelay();
  const habit = MOCK.habits.find((h) => h.id === id);
  if (!habit) return;
  habit.done = done;
  habit.completedAt = done ? new Date().toISOString() : null;
}

/* ------------------------------------------------------------------ */

export const todayDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    todayDashboard: build.query<TodayDashboardDto, void>({
      queryFn: async () => ({ data: await fetchTodayDashboard() }),
      providesTags: ["Today"],
    }),

    toggleHabit: build.mutation<void, { id: string; done: boolean }>({
      queryFn: async ({ id, done }) => {
        await toggleHabit(id, done);
        return { data: undefined };
      },
      // チェックの反応は即座に返す（楽観更新）。失敗したら巻き戻す
      onQueryStarted: async ({ id, done }, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          todayDataSource.util.updateQueryData(
            "todayDashboard",
            undefined,
            (draft) => {
              const habit = draft.habits.find((h) => h.id === id);
              if (!habit) return;
              habit.done = done;
              habit.completedAt = done ? new Date().toISOString() : null;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Today"],
    }),
  }),
});
