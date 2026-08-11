/**
 * `POST /api/v1/auth/signup` / `POST /api/v1/auth/login` / `POST /api/v1/auth/refresh`
 * のレスポンス型。認証方式は JWT（`docs/api-contract.md` §3）。
 */
export interface UserDto {
  id: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  /** RFC 3339 / UTC */
  createdAt: string;
  /** RFC 3339 / UTC。オンボーディング未完了なら null */
  onboardingCompletedAt: string | null;
}

export interface SessionDto {
  /** アクセストークン（JWT）。data 層より外に出さない */
  accessToken: string;
  /** RFC 3339 / UTC。アクセストークンの失効時刻 */
  accessTokenExpiresAt: string;
  /** リフレッシュトークン。サーバ側でローテーションする */
  refreshToken: string;
  user: UserDto;
}
