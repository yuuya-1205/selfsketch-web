import { useQuery } from "@tanstack/react-query";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * モック用のクエリラッパー。
 *
 * `initialData` を渡しているので呼び出し側はローディング分岐なしで値を使える。
 * 実 API に繋ぐときは：
 *   1. queryFn を `fetch(...)` に差し替える
 *   2. initialData を外す（= 各ページでローディング表示を足す）
 * の2ステップ。UI コンポーネント側の変更は不要。
 */
export function useMockQuery<T>(key: readonly unknown[], value: T): T {
  const { data } = useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      await delay(60);
      return value;
    },
    initialData: value,
  });
  return data ?? value;
}
