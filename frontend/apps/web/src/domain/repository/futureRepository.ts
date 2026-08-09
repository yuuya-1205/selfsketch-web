import type { Vision } from "@/domain/model/vision";
import type { RepositoryResult } from "./result";

export interface FutureRepository {
  /** id 未指定は「いま表示中のビジョン」 */
  useVision(id?: string): RepositoryResult<Vision>;
}
