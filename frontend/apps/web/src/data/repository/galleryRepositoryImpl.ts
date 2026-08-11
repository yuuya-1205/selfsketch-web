import type { GalleryRepository } from "@/domain/repository/galleryRepository";
import { galleryDataSource } from "@/data/datasource/galleryDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toGalleryItem, toGalleryMonth } from "@/data/mapper/gallery";

export const galleryRepository: GalleryRepository = {
  useMonths() {
    const { data, isLoading, error, refetch } =
      galleryDataSource.useGalleryMonthsQuery();
    return {
      data: data?.map(toGalleryMonth),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },

  useGrid() {
    const { data, isLoading, error, refetch } =
      galleryDataSource.useGalleryGridQuery();
    return {
      data: data?.map(toGalleryItem),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },

  useItem(id) {
    // グリッドと同じキャッシュから引く（追加のリクエストは出さない）
    const { item } = galleryDataSource.useGalleryGridQuery(undefined, {
      selectFromResult: ({ data }) => ({
        item: data?.find((i) => i.id === id) ?? data?.[0],
      }),
    });
    return item && toGalleryItem(item);
  },
};
