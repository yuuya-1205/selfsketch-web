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
  /**
   * 取り直す。失敗したときの「再試行」がこれを呼ぶ（.pen の W-State 1）。
   * 再試行の口が無いと、エラー画面がただの行き止まりになる。
   */
  retry: () => void;
}
