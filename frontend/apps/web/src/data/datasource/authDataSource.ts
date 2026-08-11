import { baseApi, mockDelay } from "@/lib/api/baseApi";
import { fallbackDisplayName } from "@/domain/model/auth";
import type { SessionDto, UserDto } from "@/data/dto/auth";

/* ------------------------------------------------------------------ *
 * モック。差し替え手順は baseApi.ts のコメントを参照。
 *
 * 実 API 化のときは、この節をまるごと以下に置き換える:
 *   POST  /api/v1/auth/signup   -> SessionDto
 *   POST  /api/v1/auth/login    -> SessionDto
 *   POST  /api/v1/auth/refresh  -> SessionDto
 *   POST  /api/v1/auth/logout   -> 204
 *   PATCH /api/v1/me            -> UserDto（オンボーディング完了の記録）
 * トークンをどこに保管するかもここだけの関心事で、Repository より上の層は
 * SessionDto しか知らない。
 * ------------------------------------------------------------------ */

const USERS_KEY = "selfsketch:auth:users";
const SESSION_KEY = "selfsketch:auth:session";

/** アクセストークンの寿命。短命にしてリフレッシュで繋ぐ（api-contract.md §3） */
const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
/** リフレッシュトークンの寿命 */
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface StoredUser extends UserDto {
  /** モックなので照合できれば十分。実装ではサーバ側で bcrypt / argon2id を使う */
  passwordDigest: string;
}

interface StoredSession {
  userId: string;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

/** デモ用の既存アカウント。パスワードは selfsketch */
const SEED: Omit<StoredUser, "passwordDigest"> = {
  id: "u1",
  email: "yuki@example.com",
  displayName: "ゆうき",
  emailVerified: true,
  createdAt: "2025-10-31T15:00:00Z",
  onboardingCompletedAt: "2025-10-31T15:12:00Z",
};
const SEED_PASSWORD = "selfsketch";

/** RTK Query の queryFn が返せる形。エラーは data/mapper/error.ts が解釈する */
type MockResult<T> =
  | { data: T }
  | {
      error: {
        status: number;
        data: { error: { code: string; message: string } };
      };
    };

function failure(
  status: number,
  code: string,
  message: string,
): MockResult<never> {
  return { error: { status, data: { error: { code, message } } } };
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    // プライベートモードや JSON 破損。未ログイン扱いで続行する
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 保存できなくてもこのタブの操作は続けられるので握りつぶす
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // 同上
  }
}

async function digest(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`selfsketch:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function loadUsers(): Promise<StoredUser[]> {
  const stored = read<StoredUser[]>(USERS_KEY);
  if (stored && stored.length > 0) return stored;

  const seeded: StoredUser[] = [
    { ...SEED, passwordDigest: await digest(SEED_PASSWORD) },
  ];
  write(USERS_KEY, seeded);
  return seeded;
}

/** モックのトークン。実 API では JWT が返ってくる */
function issueToken(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function startSession(userId: string, now: Date): StoredSession {
  const session: StoredSession = {
    userId,
    accessToken: issueToken("at"),
    accessTokenExpiresAt: new Date(
      now.getTime() + ACCESS_TOKEN_TTL_MS,
    ).toISOString(),
    refreshToken: issueToken("rt"),
    refreshTokenExpiresAt: new Date(
      now.getTime() + REFRESH_TOKEN_TTL_MS,
    ).toISOString(),
  };
  write(SESSION_KEY, session);
  return session;
}

function toSessionDto(session: StoredSession, user: StoredUser): SessionDto {
  const { passwordDigest: _digest, ...rest } = user;
  return {
    accessToken: session.accessToken,
    accessTokenExpiresAt: session.accessTokenExpiresAt,
    refreshToken: session.refreshToken,
    user: rest,
  };
}

/**
 * 保存済みのセッションを読む。アクセストークンが切れていて
 * リフレッシュトークンが生きていればその場で再発行する
 * （実 API での POST /auth/refresh に相当）。
 */
async function fetchSession(): Promise<SessionDto | null> {
  await mockDelay(60);

  const stored = read<StoredSession>(SESSION_KEY);
  if (!stored) return null;

  const now = new Date();
  if (new Date(stored.refreshTokenExpiresAt).getTime() <= now.getTime()) {
    remove(SESSION_KEY);
    return null;
  }

  const user = (await loadUsers()).find((u) => u.id === stored.userId);
  if (!user) {
    remove(SESSION_KEY);
    return null;
  }

  const fresh =
    new Date(stored.accessTokenExpiresAt).getTime() <= now.getTime()
      ? startSession(user.id, now)
      : stored;

  return toSessionDto(fresh, user);
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

async function signUp(input: SignUpRequest): Promise<MockResult<SessionDto>> {
  await mockDelay(220);

  const email = input.email.trim().toLowerCase();
  const users = await loadUsers();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return failure(409, "conflict", `email already registered: ${email}`);
  }

  const now = new Date();
  const user: StoredUser = {
    id: `u_${crypto.randomUUID()}`,
    email,
    // 表示名は登録時に訊かない。設定画面であとから変えられる
    displayName: fallbackDisplayName(email),
    emailVerified: false,
    createdAt: now.toISOString(),
    onboardingCompletedAt: null,
    passwordDigest: await digest(input.password),
  };
  write(USERS_KEY, [...users, user]);

  return { data: toSessionDto(startSession(user.id, now), user) };
}

async function login(input: LoginRequest): Promise<MockResult<SessionDto>> {
  await mockDelay(220);

  const email = input.email.trim().toLowerCase();
  const user = (await loadUsers()).find((u) => u.email.toLowerCase() === email);
  const passwordDigest = await digest(input.password);

  // 「メールが無い」と「パスワードが違う」を区別しない（アカウント列挙の手がかりになる）
  if (!user || user.passwordDigest !== passwordDigest) {
    return failure(401, "unauthorized", "invalid email or password");
  }

  return { data: toSessionDto(startSession(user.id, new Date()), user) };
}

async function completeOnboarding(): Promise<MockResult<SessionDto>> {
  await mockDelay();

  const stored = read<StoredSession>(SESSION_KEY);
  if (!stored) return failure(401, "unauthorized", "no session");

  const users = await loadUsers();
  const current = users.find((u) => u.id === stored.userId);
  if (!current) return failure(401, "unauthorized", "user not found");

  const user: StoredUser = {
    ...current,
    onboardingCompletedAt:
      current.onboardingCompletedAt ?? new Date().toISOString(),
  };
  write(
    USERS_KEY,
    users.map((u) => (u.id === user.id ? user : u)),
  );

  return { data: toSessionDto(stored, user) };
}

/* ------------------------------------------------------------------ */

export const authDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    session: build.query<SessionDto | null, void>({
      queryFn: async () => ({ data: await fetchSession() }),
      providesTags: ["Auth"],
    }),

    signUp: build.mutation<SessionDto, SignUpRequest>({
      queryFn: (input) => signUp(input),
      invalidatesTags: ["Auth"],
    }),

    login: build.mutation<SessionDto, LoginRequest>({
      queryFn: (input) => login(input),
      invalidatesTags: ["Auth"],
    }),

    logout: build.mutation<void, void>({
      queryFn: async () => {
        await mockDelay();
        remove(SESSION_KEY);
        return { data: undefined };
      },
      // 前のユーザーのキャッシュを残さない。session も取り直されて null になる
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(baseApi.util.resetApiState());
      },
    }),

    completeOnboarding: build.mutation<SessionDto, void>({
      queryFn: () => completeOnboarding(),
      invalidatesTags: ["Auth"],
    }),
  }),
});
