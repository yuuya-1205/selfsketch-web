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
}
