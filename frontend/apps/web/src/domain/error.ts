/**
 * ドメインのエラー。
 *
 * backend は `{ error: { code, message } }` を返す（`backend-conventions`）。
 * その `code` をここの `DomainErrorCode` に写し、`message`（開発者向け）は
 * `detail` に入れる。ユーザー向けの文言は presentation が `code` から引く。
 *
 * data 層より外に RTK Query の FetchBaseQueryError を漏らさないための境界。
 */
export type DomainErrorCode =
  "not_found" | "conflict" | "invalid" | "unauthorized" | "network" | "unknown";

export interface DomainError {
  code: DomainErrorCode;
  /** 開発者向け。画面には出さない */
  detail: string;
}

export function domainError(
  code: DomainErrorCode,
  detail: string,
): DomainError {
  return { code, detail };
}
