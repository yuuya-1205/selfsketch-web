import { useRepositories } from "@/presentation/di/repositories";

/** ジャーナルの一覧と、選択中のエントリー。詳細は一覧と同じキャッシュから引く */
export function useJournal(selectedId: string | undefined) {
  const { data, isLoading, error } = useRepositories().journal.useEntries();

  return {
    entries: data,
    entry: data?.find((e) => e.id === selectedId) ?? data?.[0],
    isLoading,
    error,
  };
}
