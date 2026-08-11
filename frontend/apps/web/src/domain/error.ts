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

/**
 * Repository の書き込みが失敗したときに throw する例外。
 * data 層が RTK Query のエラーをこれに包み直すので、上の層は
 * `error.domainError.code` だけを見れば分岐できる。
 */
export class DomainErrorException extends Error {
  readonly domainError: DomainError;

  constructor(error: DomainError) {
    super(error.detail);
    this.name = "DomainErrorException";
    this.domainError = error;
  }
}

/** unknown な throw から DomainError を取り出す。取れなければ unknown 扱い */
export function asDomainError(error: unknown): DomainError {
  if (error instanceof DomainErrorException) return error.domainError;
  return domainError(
    "unknown",
    error instanceof Error ? error.message : String(error),
  );
}
