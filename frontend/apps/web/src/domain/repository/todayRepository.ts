import type { TodayDashboard } from "@/domain/model/today";
import type { RepositoryResult } from "./result";

/**
 * 今日ダッシュボードの取得と更新。
 *
 * 読み取りがフックなのは、実装が RTK Query のフックを使うため
 * （フックはコンポーネント本体でしか呼べない）。interface は domain 側に置き、
 * data 側がこれを実装する = 依存性逆転。
 */
export interface TodayRepository {
  useDashboard(): RepositoryResult<TodayDashboard>;
  /** 返る関数は完了状態を切り替える。楽観更新は実装側の責務 */
  useToggleHabit(): (id: string, done: boolean) => Promise<void>;
}
