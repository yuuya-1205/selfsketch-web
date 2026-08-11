import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button, Checkbox, Field, Input } from "@selfsketch/ui";
import {
  AuthHeading,
  AuthLayout,
  AuthSubtext,
} from "@/components/layout/AuthLayout";
import { PASSWORD_MIN_LENGTH } from "@/domain/model/auth";
import { useSignUp, type AuthFailure } from "@/usecase/auth";
import { AuthAlert, FieldError } from "@/features/auth/components/AuthFeedback";

/** .pen: W-Auth 2 - サインアップ */
export function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signUp = useSignUp();

  /** ようこそ画面で入れたメールを引き継ぐ */
  const handedOverEmail = (location.state as { email?: string } | null)?.email;

  const [email, setEmail] = useState(handedOverEmail ?? "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [failure, setFailure] = useState<AuthFailure | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setFailure(null);
    setIsSubmitting(true);
    const result = await signUp({
      email,
      password,
      passwordConfirmation,
      termsAccepted,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setFailure(result.failure);
      return;
    }

    navigate("/onboarding/goal", { replace: true });
  }

  return (
    <AuthLayout
      stepLabel="ACCOUNT — 新規登録"
      quoteSub="毎日の小さなスケッチを積み重ねて、なりたい自分に近づいていく。まずはアカウントを作るところから。"
      title="新規登録"
    >
      <AuthHeading>アカウントを作る</AuthHeading>
      <AuthSubtext>メールアドレスがあれば1分で始められます。</AuthSubtext>

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

        <Field label="パスワード">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={`${PASSWORD_MIN_LENGTH}文字以上`}
            autoComplete="new-password"
          />
          <FieldError failure={failure} field="password" />
        </Field>

        <Field label="パスワード（確認）">
          <Input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="もう一度入力"
            autoComplete="new-password"
          />
          <FieldError failure={failure} field="passwordConfirmation" />
        </Field>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2.5">
            <Checkbox
              checked={termsAccepted}
              onChange={setTermsAccepted}
              aria-label="利用規約とプライバシーポリシーに同意する"
            />
            <span className="text-xs font-medium text-brown">
              利用規約とプライバシーポリシーに同意する
            </span>
          </label>
          <FieldError failure={failure} field="terms" />
        </div>

        <Button
          type="submit"
          size="lg"
          block
          disabled={isSubmitting}
          className="h-[46px]"
        >
          {isSubmitting ? "作成中…" : "アカウントを作る"}
        </Button>
      </form>

      <p className="flex justify-center gap-1.5 text-xs">
        <span className="font-medium text-brown">
          すでにアカウントをお持ちの方は
        </span>
        <Link to="/login" className="font-bold text-ink underline">
          ログイン
        </Link>
      </p>
    </AuthLayout>
  );
}
