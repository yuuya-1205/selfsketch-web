import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button, Field, Input } from "@selfsketch/ui";
import {
  AuthHeading,
  AuthLayout,
  AuthSubtext,
} from "@/components/layout/AuthLayout";
import { hasCompletedOnboarding } from "@/domain/model/auth";
import { useLogin, type AuthFailure } from "@/usecase/auth";
import { AuthAlert, FieldError } from "@/features/auth/components/AuthFeedback";

/** .pen: W-Auth 1 - ログイン */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState<AuthFailure | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** ガードに弾かれて来た場合は、ログイン後に元のページへ戻す */
  const from = (location.state as { from?: string } | null)?.from;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setFailure(null);
    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (!result.ok) {
      setFailure(result.failure);
      return;
    }

    // オンボーディングが途中のアカウントは続きから
    navigate(
      hasCompletedOnboarding(result.session.user)
        ? (from ?? "/today")
        : "/onboarding/goal",
      { replace: true },
    );
  }

  return (
    <AuthLayout
      stepLabel="ACCOUNT — ログイン"
      quote={
        <>
          おかえりなさい。
          <br />
          続きから始めましょう。
        </>
      }
      quoteSub="5分の記録が、あなたの手に残っています。今日もその続きを。"
      title="ログイン"
    >
      <AuthHeading>ログイン</AuthHeading>
      <AuthSubtext>メールアドレスとパスワードを入力してください。</AuthSubtext>

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

        {/* ラベル行に再設定への導線を置くので Field は使わない
            （Field は label 要素で包むため、中のリンクが入力欄にフォーカスを奪われる） */}
        <div className="flex w-full flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label
              htmlFor="login-password"
              className="flex-1 text-[11px] font-bold tracking-[1.2px] text-muted"
            >
              パスワード
            </label>
            <Link
              to="/password-reset"
              className="text-[11px] font-semibold text-brown hover:text-ink"
            >
              パスワードを忘れた方
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上"
            autoComplete="current-password"
          />
          <FieldError failure={failure} field="password" />
        </div>

        <Button
          type="submit"
          size="lg"
          block
          disabled={isSubmitting}
          className="h-[46px]"
        >
          {isSubmitting ? "確認中…" : "ログイン"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] font-semibold text-muted">または</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button size="lg" block variant="outline" className="h-[46px]">
        Google で続ける
      </Button>

      <p className="flex justify-center gap-1.5 text-xs">
        <span className="font-medium text-brown">
          アカウントをお持ちでない方は
        </span>
        <Link to="/signup" className="font-bold text-ink underline">
          新規登録
        </Link>
      </p>
    </AuthLayout>
  );
}
