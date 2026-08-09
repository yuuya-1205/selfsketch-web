import type { DomainError } from "@/domain/error";

/**
 * Repository の読み取り結果。画面はこの形だけを知っていればよい。
 *
 * RTK Query のフックはコンポーネント本体でしか呼べないため、Repository の
 * 読み取り側はフックとして公開する（`useDashboard(): RepositoryResult<T>`）。
 * interface は domain 側に置いたまま、実装がフックを提供する形にしている。
 */
export interface RepositoryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: DomainError | null;
}
