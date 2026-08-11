import type { ReflectionEntry } from "@/domain/model/reflection";
import type { ReflectionEntryDto } from "@/data/dto/reflection";

export function toReflectionEntry(dto: ReflectionEntryDto): ReflectionEntry {
  return {
    kind: dto.kind,
    lastUsedAt: dto.lastUsedAt ? new Date(dto.lastUsedAt) : null,
  };
}

export function toReflectionEntries(
  dtos: ReflectionEntryDto[],
): ReflectionEntry[] {
  return dtos.map(toReflectionEntry);
}
