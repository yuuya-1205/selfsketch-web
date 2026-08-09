import type { JournalEntry } from "@/domain/model/journal";
import type { JournalEntryDto } from "@/data/dto/journal";

export function toJournalEntry(dto: JournalEntryDto): JournalEntry {
  return {
    id: dto.id,
    writtenAt: new Date(dto.writtenAt),
    title: dto.title,
    excerpt: dto.excerpt,
    body: dto.body,
    hasImage: dto.hasImage,
    habitTitle: dto.habitTitle,
    mood: dto.mood,
    tags: dto.tags,
    quote: dto.quote,
    stats: { ...dto.stats },
  };
}
