import { useRepositories } from "@/presentation/di/repositories";

export function useGalleryTimeline() {
  const { data, isLoading, error } = useRepositories().gallery.useMonths();
  return { months: data, isLoading, error };
}

export function useGalleryGrid() {
  const { data, isLoading, error } = useRepositories().gallery.useGrid();
  return { items: data, isLoading, error };
}

/** ライトボックス用。グリッドのキャッシュから 1 件だけ取り出す */
export function useGalleryItem(id: string | undefined) {
  return useRepositories().gallery.useItem(id);
}
