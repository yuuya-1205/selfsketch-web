import { PASSWORD_MIN_LENGTH } from "@/domain/model/auth";
import type { AuthFailureCode } from "@/usecase/auth";

/**
 * 認証の失敗コード → ユーザー向けの文言。
 * usecase は code しか返さない（domain / usecase に日本語を持ち込まない）ので、
 * 表示する文言はこの辞書だけが持つ。i18n するときもここを差し替える。
 */
export const AUTH_FAILURE_MESSAGES: Record<AuthFailureCode, string> = {
  email_required: "メールアドレスを入力してください。",
  email_invalid: "メールアドレスの形式が正しくありません。",
  password_required: "パスワードを入力してください。",
  password_too_short: `パスワードは${PASSWORD_MIN_LENGTH}文字以上にしてください。`,
  password_mismatch: "確認用のパスワードが一致しません。",
  display_name_required: "表示名を入力してください。",
  email_taken: "このメールアドレスはすでに登録されています。",
  invalid_credentials: "メールアドレスまたはパスワードが違います。",
  network: "通信に失敗しました。接続を確かめてもう一度お試しください。",
  unknown: "うまくいきませんでした。しばらくしてからお試しください。",
};
