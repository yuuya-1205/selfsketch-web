import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TodayDashboard } from "./types";

/* ------------------------------------------------------------------ *
 * モック実装。
 * 実 API ができたら fetchTodayDashboard / toggleHabit の中身だけを
 *   const res = await fetch("/api/v1/today", { credentials: "include" });
 * に置き換える。呼び出し側（フック以降）は変更不要。
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

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchTodayDashboard(): Promise<TodayDashboard> {
  await delay(120);
  return structuredClone(MOCK);
}

async function toggleHabit(id: string, done: boolean): Promise<void> {
  await delay(80);
  const habit = MOCK.habits.find((h) => h.id === id);
  if (!habit) return;
  habit.done = done;
  habit.meta = done ? "完了済 · たった今" : habit.slot + " · 未完了";
  MOCK.completedCount = MOCK.habits.filter((h) => h.done).length;
}

/* ------------------------------------------------------------------ */

export const todayQueryKey = ["today"] as const;

export function useTodayDashboard() {
  return useQuery({
    queryKey: todayQueryKey,
    queryFn: fetchTodayDashboard,
  });
}

export function useToggleHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      toggleHabit(id, done),
    // チェックの反応は即座に返す（楽観更新）
    onMutate: async ({ id, done }) => {
      await qc.cancelQueries({ queryKey: todayQueryKey });
      const prev = qc.getQueryData<TodayDashboard>(todayQueryKey);
      if (prev) {
        const habits = prev.habits.map((h) =>
          h.id === id ? { ...h, done } : h,
        );
        qc.setQueryData<TodayDashboard>(todayQueryKey, {
          ...prev,
          habits,
          completedCount: habits.filter((h) => h.done).length,
        });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(todayQueryKey, ctx.prev);
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: todayQueryKey });
    },
  });
}
