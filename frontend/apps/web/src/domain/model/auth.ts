/** 認証済みのユーザー */
export interface User {
  id: string;
  email: string;
  displayName: string;
  /** メール確認が済んでいるか */
  emailVerified: boolean;
  /** 登録した日時 */
  createdAt: Date;
  /** オンボーディングを終えた日時。未完了なら null */
  onboardingCompletedAt: Date | null;
}

/**
 * ログイン中のセッション。
 * アクセストークン・リフレッシュトークンそのものは data 層に閉じ込める
 * （domain は「誰が、いつまでログインしているか」だけ知っていればよい）。
 */
export interface Session {
  user: User;
  /** アクセストークンの失効時刻 */
  expiresAt: Date;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpInput extends Credentials {
  displayName: string;
}

/** オンボーディング（なりたい自分 〜 最初の習慣）を終えているか */
export function hasCompletedOnboarding(user: User): boolean {
  return user.onboardingCompletedAt !== null;
}

/** アクセストークンが失効しているか */
export function isSessionExpired(session: Session, now: Date): boolean {
  return session.expiresAt.getTime() <= now.getTime();
}

/**
 * 入力の不備。ユーザー向けの文言は presentation がこの値から引く
 * （domain に日本語リテラルを持ち込まない）。
 */
export type CredentialIssue =
  | "email_required"
  | "email_invalid"
  | "password_required"
  | "password_too_short"
  | "password_mismatch"
  | "display_name_required";

export const PASSWORD_MIN_LENGTH = 8;

/** ざっくりした形式検査。厳密な判定はサーバ側で行う */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailIssue(email: string): CredentialIssue | null {
  const value = email.trim();
  if (!value) return "email_required";
  if (!EMAIL_PATTERN.test(value)) return "email_invalid";
  return null;
}

export function passwordIssue(password: string): CredentialIssue | null {
  if (!password) return "password_required";
  if (password.length < PASSWORD_MIN_LENGTH) return "password_too_short";
  return null;
}

export function displayNameIssue(displayName: string): CredentialIssue | null {
  return displayName.trim() ? null : "display_name_required";
}
