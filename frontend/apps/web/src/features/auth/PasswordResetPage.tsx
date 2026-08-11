import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Button, Field, Input } from "@selfsketch/ui";
import {
  AuthHeading,
  AuthLayout,
  AuthSubtext,
} from "@/components/layout/AuthLayout";
import { useRequestPasswordReset, type AuthFailure } from "@/usecase/auth";
import { AuthAlert, FieldError } from "@/features/auth/components/AuthFeedback";

/** .pen: W-Auth 3 - パスワード再設定 */
export function PasswordResetPage() {
  const requestReset = useRequestPasswordReset();

  const [email, setEmail] = useState("");
  /** 送信できたメールアドレス。控えを画面に出すために持つ */
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [failure, setFailure] = useState<AuthFailure | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setFailure(null);
    setIsSubmitting(true);
    const problem = await requestReset(email);
    setIsSubmitting(false);

    if (problem) {
      setFailure(problem);
      return;
    }
    setSentTo(email.trim());
  }

  return (
    <AuthLayout
      stepLabel="ACCOUNT — パスワード再設定"
      quote={
        <>
          続きは、
          <br />
          いつでも取り戻せる。
        </>
      }
      quoteSub="登録したメールアドレスに再設定用のリンクを送ります。記録は消えていません。"
      title="パスワード再設定"
    >
      <AuthHeading>パスワードを再設定</AuthHeading>
      <AuthSubtext>
        登録したメールアドレスに再設定用のリンクを送ります。
      </AuthSubtext>

      <form
        className="flex flex-col gap-3.5"
        onSubmit={handleSubmit}
        noValidate
      >
        <AuthAlert failure={failure} />

        <Field label="メールアドレス">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
          />
          <FieldError failure={failure} field="email" />
        </Field>

        <Button
          type="submit"
          size="lg"
          block
          disabled={isSubmitting}
          className="h-[46px]"
        >
          {isSubmitting ? "送信中…" : "再設定リンクを送る"}
        </Button>
      </form>

      {sentTo && (
        <div
          role="status"
          className="flex flex-col gap-1 rounded-[11px] bg-ok-bg px-4 py-3.5"
        >
          <span className="text-xs font-bold text-ok">送信しました</span>
          <span className="text-[11px] leading-[1.8] text-ok">
            {sentTo}{" "}
            にリンクを送りました。届かない場合は迷惑メールをご確認ください。
          </span>
        </div>
      )}

      <p className="flex justify-center gap-1.5 text-xs">
        <span className="font-medium text-brown">
          パスワードを思い出した方は
        </span>
        <Link to="/login" className="font-bold text-ink underline">
          ログインにもどる
        </Link>
      </p>
    </AuthLayout>
  );
}
