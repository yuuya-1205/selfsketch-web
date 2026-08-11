import { asDomainError } from "@/domain/error";
import {
  emailIssue,
  hasCompletedOnboarding,
  passwordIssue,
  termsIssue,
  type CredentialIssue,
  type Credentials,
  type Session,
  type SignUpInput,
  type User,
} from "@/domain/model/auth";
import { useRepositories } from "@/presentation/di/repositories";

/** フォームの不備。ユーザー向けの文言は presentation がこの code から引く */
export type AuthFailureCode =
  | CredentialIssue
  | "email_taken"
  | "invalid_credentials"
  | "network"
  | "unknown";

export type AuthField =
  "email" | "password" | "passwordConfirmation" | "terms" | "form";

export interface AuthFailure {
  /** 文言を出す場所。form はフォーム全体のエラー欄 */
  field: AuthField;
  code: AuthFailureCode;
}

export type AuthResult =
  { ok: true; session: Session } | { ok: false; failure: AuthFailure };

function fail(field: AuthField, code: AuthFailureCode): AuthResult {
  return { ok: false, failure: { field, code } };
}

export interface AuthState {
  user: User | undefined;
  isAuthenticated: boolean;
  /** セッションを読み込み中。ここで画面を出し分けると未ログイン扱いの誤爆を防げる */
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}

/** 現在のログイン状態。ルートガードと画面の出し分けはこれを見る */
export function useAuth(): AuthState {
  const { data, isLoading } = useRepositories().auth.useSession();

  return {
    user: data?.user,
    isAuthenticated: Boolean(data),
    // undefined は「まだ判らない」。null（未ログイン）と区別する
    isLoading: isLoading || data === undefined,
    hasCompletedOnboarding: data ? hasCompletedOnboarding(data.user) : false,
  };
}

export interface SignUpFormInput extends SignUpInput {
  passwordConfirmation: string;
}

/** 新規登録。入力の検査もここで行い、失敗は AuthFailure で返す */
export function useSignUp() {
  const signUp = useRepositories().auth.useSignUp();

  return async (input: SignUpFormInput): Promise<AuthResult> => {
    const email = emailIssue(input.email);
    if (email) return fail("email", email);

    const password = passwordIssue(input.password);
    if (password) return fail("password", password);

    if (input.password !== input.passwordConfirmation) {
      return fail("passwordConfirmation", "password_mismatch");
    }

    const terms = termsIssue(input.termsAccepted);
    if (terms) return fail("terms", terms);

    try {
      const session = await signUp({
        email: input.email.trim(),
        password: input.password,
        termsAccepted: input.termsAccepted,
      });
      return { ok: true, session };
    } catch (e) {
      const { code } = asDomainError(e);
      if (code === "conflict") return fail("email", "email_taken");
      if (code === "network") return fail("form", "network");
      return fail("form", "unknown");
    }
  };
}

/** ログイン。メールとパスワードのどちらが違うかは区別しない */
export function useLogin() {
  const login = useRepositories().auth.useLogin();

  return async (credentials: Credentials): Promise<AuthResult> => {
    const email = emailIssue(credentials.email);
    if (email) return fail("email", email);

    if (!credentials.password) return fail("password", "password_required");

    try {
      const session = await login({
        email: credentials.email.trim(),
        password: credentials.password,
      });
      return { ok: true, session };
    } catch (e) {
      const { code } = asDomainError(e);
      if (code === "unauthorized") return fail("form", "invalid_credentials");
      if (code === "network") return fail("form", "network");
      return fail("form", "unknown");
    }
  };
}

/**
 * 再設定リンクの送信を頼む。
 * 送れたかどうかは返さない（登録の有無を漏らさないため、画面は常に同じ結果を出す）。
 */
export function useRequestPasswordReset() {
  const request = useRepositories().auth.useRequestPasswordReset();

  return async (email: string): Promise<AuthFailure | null> => {
    const issue = emailIssue(email);
    if (issue) return { field: "email", code: issue };

    try {
      await request(email.trim());
      return null;
    } catch (e) {
      const { code } = asDomainError(e);
      return {
        field: "form",
        code: code === "network" ? "network" : "unknown",
      };
    }
  };
}

export function useLogout() {
  return useRepositories().auth.useLogout();
}

/** オンボーディングの完了を記録する。失敗しても「今日」へは進ませる */
export function useCompleteOnboarding() {
  const complete = useRepositories().auth.useCompleteOnboarding();

  return async (): Promise<void> => {
    try {
      await complete();
    } catch {
      // 記録に失敗しても操作を止めない。次回のセッション取得でまた試せる
    }
  };
}
