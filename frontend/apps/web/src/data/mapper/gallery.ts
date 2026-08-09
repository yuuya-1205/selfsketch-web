import type { GalleryItem, GalleryMonth } from "@/domain/model/gallery";
import type { GalleryItemDto, GalleryMonthDto } from "@/data/dto/gallery";

export function toGalleryItem(dto: GalleryItemDto): GalleryItem {
  return {
    id: dto.id,
    createdAt: new Date(dto.createdAt),
    title: dto.title,
    seed: dto.seed,
  };
}

export function toGalleryMonth(dto: GalleryMonthDto): GalleryMonth {
  return {
    month: new Date(dto.month),
    count: dto.count,
    note: dto.note,
    items: dto.items.map(toGalleryItem),
  };
}
