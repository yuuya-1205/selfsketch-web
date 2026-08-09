import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  domainError,
  type DomainError,
  type DomainErrorCode,
} from "@/domain/error";

/** backend が返すエラーボディ（backend-conventions のエラー規約） */
interface ApiErrorBody {
  error: { code: string; message: string };
}

const BY_STATUS: Record<number, DomainErrorCode> = {
  400: "invalid",
  401: "unauthorized",
  403: "unauthorized",
  404: "not_found",
  409: "conflict",
  422: "invalid",
};

const KNOWN_CODES: DomainErrorCode[] = [
  "not_found",
  "conflict",
  "invalid",
  "unauthorized",
  "network",
  "unknown",
];

function isApiErrorBody(data: unknown): data is ApiErrorBody {
  if (typeof data !== "object" || data === null || !("error" in data)) {
    return false;
  }
  const e = (data as { error: unknown }).error;
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    typeof (e as { code: unknown }).code === "string"
  );
}

/**
 * RTK Query のエラーを DomainError に正規化する。
 * data 層より外に FetchBaseQueryError を漏らさないための関門。
 *
 * backend は `{ error: { code, message } }` を返すので、code が
 * DomainErrorCode として知られていればそれを優先し、無ければ
 * HTTP ステータスから引く。
 */
export function toDomainError(
  error: FetchBaseQueryError | SerializedError | undefined,
): DomainError | null {
  if (!error) return null;

  // SerializedError（thunk が投げた素の Error）
  if (!("status" in error)) {
    return domainError("unknown", error.message ?? "原因不明のエラー");
  }

  if (typeof error.status === "number") {
    if (isApiErrorBody(error.data)) {
      const { code, message } = error.data.error;
      const known = KNOWN_CODES.find((c) => c === code);
      return domainError(
        known ?? BY_STATUS[error.status] ?? "unknown",
        `${code}: ${message}`,
      );
    }
    return domainError(
      BY_STATUS[error.status] ?? "unknown",
      `HTTP ${error.status}`,
    );
  }

  switch (error.status) {
    case "FETCH_ERROR":
    case "TIMEOUT_ERROR":
      return domainError("network", error.error);
    case "PARSING_ERROR":
      return domainError("unknown", `レスポンスを解釈できない: ${error.error}`);
    default:
      return domainError("unknown", error.error ?? "原因不明のエラー");
  }
}
