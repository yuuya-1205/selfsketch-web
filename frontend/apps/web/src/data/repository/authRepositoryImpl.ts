import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { DomainErrorException, domainError } from "@/domain/error";
import type { AuthRepository } from "@/domain/repository/authRepository";
import { authDataSource } from "@/data/datasource/authDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toSession } from "@/data/mapper/auth";
import type { SessionDto } from "@/data/dto/auth";

/**
 * AuthRepository の実装。
 *
 * 書き込みの失敗は DomainErrorException に包み直す。RTK Query の
 * FetchBaseQueryError を上の層に漏らさないための関門で、
 * usecase は `error.domainError.code` だけを見て分岐できる。
 */
async function withDomainError(
  request: Promise<SessionDto>,
): Promise<SessionDto> {
  try {
    return await request;
  } catch (e) {
    const error = toDomainError(e as FetchBaseQueryError | SerializedError);
    throw new DomainErrorException(
      error ?? domainError("unknown", "原因不明のエラー"),
    );
  }
}

export const authRepository: AuthRepository = {
  useSession() {
    const { data, isLoading, error } = authDataSource.useSessionQuery();
    return {
      // data が undefined なら「まだ判らない」、null なら「未ログイン」
      data: data && toSession(data),
      isLoading,
      error: toDomainError(error),
    };
  },

  useSignUp() {
    const [signUp] = authDataSource.useSignUpMutation();
    return async (input) =>
      toSession(
        await withDomainError(
          signUp({
            email: input.email,
            password: input.password,
            displayName: input.displayName,
          }).unwrap(),
        ),
      );
  },

  useLogin() {
    const [login] = authDataSource.useLoginMutation();
    return async (credentials) =>
      toSession(
        await withDomainError(
          login({
            email: credentials.email,
            password: credentials.password,
          }).unwrap(),
        ),
      );
  },

  useLogout() {
    const [logout] = authDataSource.useLogoutMutation();
    return async () => {
      await logout().unwrap();
    };
  },

  useCompleteOnboarding() {
    const [complete] = authDataSource.useCompleteOnboardingMutation();
    return async () => toSession(await withDomainError(complete().unwrap()));
  },
};
