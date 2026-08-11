import { AlertCircle } from "lucide-react";
import { AUTH_FAILURE_MESSAGES } from "@/presentation/constants/authMessages";
import type { AuthFailure, AuthField } from "@/usecase/auth";

/** フォーム全体のエラー。認証失敗や通信不良はここに出す */
export function AuthAlert({ failure }: { failure: AuthFailure | null }) {
  if (!failure || failure.field !== "form") return null;

  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-[11px] bg-danger-bg px-3.5 py-3 text-[13px] leading-[1.7] font-semibold text-danger"
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      {AUTH_FAILURE_MESSAGES[failure.code]}
    </p>
  );
}

/** 入力欄ごとのエラー。該当する欄のときだけ出す */
export function FieldError({
  failure,
  field,
}: {
  failure: AuthFailure | null;
  field: AuthField;
}) {
  if (!failure || failure.field !== field) return null;

  return (
    <span role="alert" className="text-[11px] font-semibold text-danger">
      {AUTH_FAILURE_MESSAGES[failure.code]}
    </span>
  );
}
