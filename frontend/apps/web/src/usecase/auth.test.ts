import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { DomainErrorException, domainError } from "@/domain/error";
import type { Session } from "@/domain/model/auth";
import type { AuthRepository } from "@/domain/repository/authRepository";
import type { Repositories } from "@/presentation/di/repositories";
import { RepositoryContext } from "@/presentation/di/repositories";
import { createElement, type ReactNode } from "react";
import { useAuth, useLogin, useSignUp } from "./auth";

const SESSION: Session = {
  user: {
    id: "u1",
    email: "yuki@example.com",
    displayName: "ゆうき",
    emailVerified: true,
    createdAt: new Date("2025-11-01T15:00:00Z"),
    onboardingCompletedAt: null,
  },
  expiresAt: new Date("2026-04-22T01:00:00Z"),
};

/** フェイクは RepositoryResult を返すだけの素のオブジェクト（arch スキル） */
function fakeAuth(overrides: Partial<AuthRepository> = {}): AuthRepository {
  return {
    useSession: () => ({
      data: null,
      isLoading: false,
      error: null,
      retry: () => {},
    }),
    useSignUp: () => async () => SESSION,
    useLogin: () => async () => SESSION,
    useLogout: () => async () => {},
    useCompleteOnboarding: () => async () => SESSION,
    ...overrides,
  };
}

function wrapperFor(auth: AuthRepository) {
  const repositories = { auth } as Repositories;
  return ({ children }: { children: ReactNode }) =>
    createElement(RepositoryContext, { value: repositories }, children);
}

const VALID_SIGN_UP = {
  email: "new@example.com",
  password: "selfsketch",
  passwordConfirmation: "selfsketch",
  termsAccepted: true,
};

describe("useAuth", () => {
  it("セッションが null なら未ログイン", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperFor(fakeAuth()),
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("undefined のあいだは読み込み中（未ログインと区別する）", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperFor(
        fakeAuth({
          useSession: () => ({
            data: undefined,
            isLoading: false,
            error: null,
            retry: () => {},
          }),
        }),
      ),
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("オンボーディング完了日時の有無を見分ける", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapperFor(
        fakeAuth({
          useSession: () => ({
            data: SESSION,
            isLoading: false,
            error: null,
            retry: () => {},
          }),
        }),
      ),
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.hasCompletedOnboarding).toBe(false);
  });
});

describe("useSignUp", () => {
  it.each([
    [{ email: "not-an-email" }, "email", "email_invalid"],
    [{ password: "short" }, "password", "password_too_short"],
    [
      { passwordConfirmation: "different" },
      "passwordConfirmation",
      "password_mismatch",
    ],
    [{ termsAccepted: false }, "terms", "terms_required"],
  ])("入力の不備を送信前に返す (%o)", async (patch, field, code) => {
    const { result } = renderHook(() => useSignUp(), {
      wrapper: wrapperFor(fakeAuth()),
    });

    const outcome = await result.current({ ...VALID_SIGN_UP, ...patch });
    expect(outcome).toEqual({ ok: false, failure: { field, code } });
  });

  it("重複したメールは email 欄のエラーにする", async () => {
    const { result } = renderHook(() => useSignUp(), {
      wrapper: wrapperFor(
        fakeAuth({
          useSignUp: () => async () => {
            throw new DomainErrorException(domainError("conflict", "taken"));
          },
        }),
      ),
    });

    expect(await result.current(VALID_SIGN_UP)).toEqual({
      ok: false,
      failure: { field: "email", code: "email_taken" },
    });
  });

  it("成功したらセッションを返す", async () => {
    const { result } = renderHook(() => useSignUp(), {
      wrapper: wrapperFor(fakeAuth()),
    });
    expect(await result.current(VALID_SIGN_UP)).toEqual({
      ok: true,
      session: SESSION,
    });
  });
});

describe("useLogin", () => {
  it("認証に失敗したらフォーム全体のエラーにする（どちらが違うか出さない）", async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: wrapperFor(
        fakeAuth({
          useLogin: () => async () => {
            throw new DomainErrorException(domainError("unauthorized", "no"));
          },
        }),
      ),
    });

    expect(
      await result.current({ email: "yuki@example.com", password: "wrong" }),
    ).toEqual({
      ok: false,
      failure: { field: "form", code: "invalid_credentials" },
    });
  });

  it("通信不良はネットワークエラーとして返す", async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: wrapperFor(
        fakeAuth({
          useLogin: () => async () => {
            throw new DomainErrorException(domainError("network", "offline"));
          },
        }),
      ),
    });

    expect(
      await result.current({
        email: "yuki@example.com",
        password: "selfsketch",
      }),
    ).toEqual({ ok: false, failure: { field: "form", code: "network" } });
  });

  it("パスワードが空なら送信しない", async () => {
    let called = false;
    const { result } = renderHook(() => useLogin(), {
      wrapper: wrapperFor(
        fakeAuth({
          useLogin: () => async () => {
            called = true;
            return SESSION;
          },
        }),
      ),
    });

    expect(
      await result.current({ email: "yuki@example.com", password: "" }),
    ).toEqual({
      ok: false,
      failure: { field: "password", code: "password_required" },
    });
    expect(called).toBe(false);
  });
});
