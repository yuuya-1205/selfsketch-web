import { describe, expect, it } from "vitest";
import { toDomainError } from "./error";

describe("toDomainError", () => {
  it("エラーが無ければ null", () => {
    expect(toDomainError(undefined)).toBeNull();
  });

  it("backend のエラーボディの code を優先する", () => {
    const e = toDomainError({
      status: 404,
      data: {
        error: { code: "not_found", message: "habit id=h9 が見つからない" },
      },
    });
    expect(e).toEqual({
      code: "not_found",
      detail: "not_found: habit id=h9 が見つからない",
    });
  });

  it("知らない code ならステータスから引く", () => {
    const e = toDomainError({
      status: 409,
      data: {
        error: { code: "habit_already_done", message: "既に完了している" },
      },
    });
    expect(e?.code).toBe("conflict");
    // 元の code は detail に残す（調査できるように）
    expect(e?.detail).toContain("habit_already_done");
  });

  it("エラーボディが無ければステータスだけで判定する", () => {
    expect(toDomainError({ status: 401, data: undefined })?.code).toBe(
      "unauthorized",
    );
    expect(toDomainError({ status: 500, data: "boom" })?.code).toBe("unknown");
  });

  it("通信エラーは network", () => {
    expect(
      toDomainError({ status: "FETCH_ERROR", error: "Failed to fetch" })?.code,
    ).toBe("network");
    expect(
      toDomainError({ status: "TIMEOUT_ERROR", error: "timed out" })?.code,
    ).toBe("network");
  });

  it("SerializedError も拾う", () => {
    const e = toDomainError({ name: "Error", message: "予期しない例外" });
    expect(e).toEqual({ code: "unknown", detail: "予期しない例外" });
  });

  it("開発者向けの detail はユーザー文言を含めない前提で、code だけで分岐できる", () => {
    const codes = [400, 401, 403, 404, 409, 422, 500].map(
      (status) => toDomainError({ status, data: undefined })?.code,
    );
    expect(codes).toEqual([
      "invalid",
      "unauthorized",
      "unauthorized",
      "not_found",
      "conflict",
      "invalid",
      "unknown",
    ]);
  });
});
