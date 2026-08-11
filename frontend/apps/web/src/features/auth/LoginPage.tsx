import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Lock, Mail } from "lucide-react";
import { Button, Field, Input } from "@selfsketch/ui";
import {
  AuthBody,
  AuthKicker,
  AuthLayout,
  AuthTitle,
} from "@/components/layout/AuthLayout";
import { hasCompletedOnboarding } from "@/domain/model/auth";
import { useLogin, type AuthFailure } from "@/usecase/auth";
import { AuthAlert, FieldError } from "@/features/auth/components/AuthFeedback";

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
    <AuthLayout title="ログイン">
      <AuthKicker>LOG IN</AuthKicker>
      <AuthTitle>おかえりなさい。</AuthTitle>
      <AuthBody>
        きのうまでの記録はそのまま残っています。今日のぶんを描きにいきましょう。
      </AuthBody>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <AuthAlert failure={failure} />

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
              autoFocus
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
              placeholder="8文字以上"
              className="h-12 pl-10"
              autoComplete="current-password"
            />
          </span>
          <FieldError failure={failure} field="password" />
        </Field>

        <Button type="submit" size="lg" block disabled={isSubmitting}>
          {isSubmitting ? "確認中…" : "ログイン"}
        </Button>
      </form>

      <Button size="lg" block variant="outline">
        Google で続ける
      </Button>

      <p className="text-center text-xs font-medium text-muted">
        アカウントをお持ちでないですか？{" "}
        <Link to="/signup" className="font-semibold text-ink underline">
          新規登録
        </Link>
      </p>
    </AuthLayout>
  );
}
