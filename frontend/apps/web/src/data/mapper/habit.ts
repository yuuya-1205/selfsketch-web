import type { HabitDetail, HabitNote } from "@/domain/model/habit";
import type { HabitDetailDto, HabitNoteDto } from "@/data/dto/habit";

export function toHabitNote(dto: HabitNoteDto): HabitNote {
  return { date: new Date(dto.date), body: dto.body };
}

export function toHabitDetail(dto: HabitDetailDto): HabitDetail {
  return {
    id: dto.id,
    title: dto.title,
    slot: dto.slot,
    scheduledTime: dto.scheduledTime,
    durationMinutes: dto.durationMinutes,
    linkedVision: dto.linkedVision,
    achievementRate: dto.achievementRate,
    currentStreak: dto.currentStreak,
    longestStreak: dto.longestStreak,
    totalCount: dto.totalCount,
    startedAt: new Date(dto.startedAt),
    heatmap: dto.heatmap,
    notes: dto.notes.map(toHabitNote),
  };
}
