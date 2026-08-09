import type { Vision } from "@/domain/model/vision";
import type { VisionDto } from "@/data/dto/vision";

export function toVision(dto: VisionDto): Vision {
  return {
    id: dto.id,
    horizon: dto.horizon,
    targetDate: new Date(dto.targetDate),
    quote: dto.quote,
    body: dto.body,
    progress: dto.progress,
    milestones: dto.milestones.map((m) => ({
      date: new Date(m.date),
      title: m.title,
      reached: m.reached,
    })),
    habits: dto.habits.map((h) => ({ ...h })),
    letter: dto.letter,
    story: dto.story,
    steps: dto.steps.map((s) => ({ ...s })),
  };
}
