import type { Habit, HabitSlot } from "@/domain/model/today";

/**
 * ドメインの値を画面の文言にする。
 * domain は整形済み文字列を持たないので、日本語のラベルはここに集約する
 * （i18n をやるときはこのファイルを辞書に差し替える）。
 */

export const SLOT_LABEL: Record<HabitSlot, string> = {
  morning: "毎朝",
  after_wake: "起床後",
  noon: "昼",
  afternoon: "午後",
  night: "夜",
  before_sleep: "就寝前",
};

/** 「4月22日(火)」 */
export function dateLabel(date: Date): string {
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${date.getMonth() + 1}月${date.getDate()}日(${weekday})`;
}

/** 「7:15」。分は 2 桁に揃える */
export function timeLabel(date: Date): string {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/**
 * 習慣の行に出す補助テキスト。
 * 完了なら「完了済 · 7:15」、未完了なら「午後 · 10分ほど」。
 */
export function habitMetaLabel(habit: Habit): string {
  if (habit.done && habit.completedAt) {
    return `完了済 · ${timeLabel(habit.completedAt)}`;
  }
  const slot = SLOT_LABEL[habit.slot];
  if (habit.estimatedMinutes === null) return slot;
  const suffix = habit.estimateIsApproximate ? "ほど" : "";
  return `${slot} · ${habit.estimatedMinutes}分${suffix}`;
}

/** 「毎朝 7:00」。予定時刻が無ければ時間帯だけ */
export function scheduleLabel(
  slot: HabitSlot,
  scheduledTime: string | null,
): string {
  const label = SLOT_LABEL[slot];
  if (!scheduledTime) return label;
  // "07:00" -> "7:00"（先頭のゼロは落とす）
  return `${label} ${scheduledTime.replace(/^0/, "")}`;
}

/** 「4/22 (火)」 */
export function shortDateLabel(date: Date): string {
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${date.getMonth() + 1}/${date.getDate()} (${weekday})`;
}
