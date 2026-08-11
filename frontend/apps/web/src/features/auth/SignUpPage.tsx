import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Lock, Mail, User as UserIcon } from "lucide-react";
import { Button, Field, Input } from "@selfsketch/ui";
import {
  AuthBody,
  AuthKicker,
  AuthLayout,
  AuthTitle,
} from "@/components/layout/AuthLayout";
import { PASSWORD_MIN_LENGTH } from "@/domain/model/auth";
import { useSignUp, type AuthFailure } from "@/usecase/auth";
import { AuthAlert, FieldError } from "@/features/auth/components/AuthFeedback";

export function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signUp = useSignUp();

  /** ようこそ画面で入れたメールを引き継ぐ */
  const handedOverEmail = (location.state as { email?: string } | null)?.email;

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState(handedOverEmail ?? "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [failure, setFailure] = useState<AuthFailure | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setFailure(null);
    setIsSubmitting(true);
    const result = await signUp({
      displayName,
      email,
      password,
      passwordConfirmation,
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
      step={1}
      stepLabel="STEP 1 / 4 — アカウント作成"
      title="新規登録"
    >
      <AuthKicker>SIGN UP</AuthKicker>
      <AuthTitle>アカウントをつくる</AuthTitle>
      <AuthBody>
        記録はこのアカウントに紐づいて保存されます。あとから設定でいつでも変更できます。
      </AuthBody>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <AuthAlert failure={failure} />

        <Field label="表示名">
          <span className="relative block">
            <UserIcon
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
            />
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="ゆうき"
              className="h-12 pl-10"
              autoComplete="nickname"
              autoFocus
            />
          </span>
          <FieldError failure={failure} field="displayName" />
        </Field>

        <Field label="メールアドレス">
          <span className="relative block">
            <Mail
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 pl-10"
              autoComplete="email"
            />
          </span>
          <FieldError failure={failure} field="email" />
        </Field>

        <Field label="パスワード">
          <span className="relative block">
            <Lock
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`${PASSWORD_MIN_LENGTH}文字以上`}
              className="h-12 pl-10"
              autoComplete="new-password"
            />
          </span>
          <FieldError failure={failure} field="password" />
        </Field>

        <Field label="パスワード（確認）">
          <span className="relative block">
            <Lock
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
            />
            <Input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="もう一度入力"
              className="h-12 pl-10"
              autoComplete="new-password"
            />
          </span>
          <FieldError failure={failure} field="passwordConfirmation" />
        </Field>

        <Button type="submit" size="lg" block disabled={isSubmitting}>
          {isSubmitting ? "登録中…" : "登録して続ける"}
        </Button>
      </form>

      <p className="text-center text-xs leading-[1.9] font-medium text-muted">
        登録すると利用規約とプライバシーポリシーに同意したものとみなされます。
      </p>

      <p className="text-center text-xs font-medium text-muted">
        すでにアカウントをお持ちですか？{" "}
        <Link to="/login" className="font-semibold text-ink underline">
          ログイン
        </Link>
      </p>
    </AuthLayout>
  );
}
