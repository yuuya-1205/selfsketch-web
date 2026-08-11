import type { Credentials, Session, SignUpInput } from "@/domain/model/auth";
import type { RepositoryResult } from "./result";

export interface AuthRepository {
  /** 現在のセッション。読み込み済みで未ログインなら null */
  useSession(): RepositoryResult<Session | null>;
  useSignUp(): (input: SignUpInput) => Promise<Session>;
  useLogin(): (credentials: Credentials) => Promise<Session>;
  useLogout(): () => Promise<void>;
  /** オンボーディングを終えたことを記録する */
  useCompleteOnboarding(): () => Promise<Session>;
  /**
   * 再設定リンクの送信を頼む。
   * 登録の有無で結果を変えない（変えるとアカウントの存在が分かってしまう）。
   */
  useRequestPasswordReset(): (email: string) => Promise<void>;
}
