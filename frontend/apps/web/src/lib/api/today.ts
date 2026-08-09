import { baseApi, mockDelay } from "./baseApi";
import type { TodayDashboard } from "./types";

/* ------------------------------------------------------------------ *
 * モック実装。差し替え手順は baseApi.ts のコメントを参照。
 * ------------------------------------------------------------------ */

const MOCK: TodayDashboard = {
  dateLabel: "4月22日(火)",
  completedCount: 3,
  totalCount: 5,
  habits: [
    {
      id: "h1",
      title: "5分スケッチ",
      meta: "完了済 · 7:15",
      done: true,
      slot: "毎朝",
    },
    {
      id: "h2",
      title: "朝のストレッチ",
      meta: "完了済 · 8:02",
      done: true,
      slot: "起床後",
    },
    {
      id: "h3",
      title: "1日1ページ読書",
      meta: "完了済 · 12:40",
      done: true,
      slot: "昼",
    },
    {
      id: "h4",
      title: "好きな絵を1枚見る",
      meta: "午後 · 10分ほど",
      done: false,
      slot: "午後",
    },
    {
      id: "h5",
      title: "夜のリフレクション",
      meta: "就寝前 · 3分",
      done: false,
      slot: "夜",
    },
  ],
  streak: {
    current: 12,
    longest: 21,
    week: [true, true, true, true, false, false, false],
  },
  future: {
    title: "1年後の自分",
    remainingDays: 312,
    progress: 0.34,
    thumbnailUrl: null,
  },
  todayQuote: "「うまく描けない日も、線は残る。」",
  weekCompletion: [0.6, 1, 0.8, 1, 0.4, 0.2, 0],
  sketchLogged: false,
};

async function fetchTodayDashboard(): Promise<TodayDashboard> {
  await mockDelay(120);
  return structuredClone(MOCK);
}

async function toggleHabit(id: string, done: boolean): Promise<void> {
  await mockDelay();
  const habit = MOCK.habits.find((h) => h.id === id);
  if (!habit) return;
  habit.done = done;
  habit.meta = done ? "完了済 · たった今" : habit.slot + " · 未完了";
  MOCK.completedCount = MOCK.habits.filter((h) => h.done).length;
}

/* ------------------------------------------------------------------ */

export const todayApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    todayDashboard: build.query<TodayDashboard, void>({
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
          todayApi.util.updateQueryData(
            "todayDashboard",
            undefined,
            (draft) => {
              const habit = draft.habits.find((h) => h.id === id);
              if (!habit) return;
              habit.done = done;
              draft.completedCount = draft.habits.filter((h) => h.done).length;
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

export const { useTodayDashboardQuery, useToggleHabitMutation } = todayApi;
