import type { GalleryItem, GalleryMonth } from "@/domain/model/gallery";
import type { RepositoryResult } from "./result";

export interface GalleryRepository {
  useMonths(): RepositoryResult<GalleryMonth[]>;
  useGrid(): RepositoryResult<GalleryItem[]>;
  /** グリッドのキャッシュから 1 件だけ取り出す（追加のリクエストは出さない） */
  useItem(id: string | undefined): GalleryItem | undefined;
}
