import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Mail } from "lucide-react";
import { Button, Input } from "@selfsketch/ui";
import {
  AuthBody,
  AuthKicker,
  AuthLayout,
  AuthTitle,
} from "@/components/layout/AuthLayout";

export function WelcomePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  /** 入力したメールは新規登録画面へ引き継ぐ（打ち直させない） */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/signup", { state: { email } });
  }

  return (
    <AuthLayout step={1} stepLabel="STEP 1 / 4 — ようこそ" title="ようこそ">
      <AuthKicker>WELCOME</AuthKicker>
      <AuthTitle>
        はじめまして。
        <br />
        これからの自分を描こう。
      </AuthTitle>
      <AuthBody>
        1日5分の記録が、6か月後・1年後・10年後のあなたを形づくります。まずはメールアドレスだけで始められます。
      </AuthBody>

      <form className="flex flex-col gap-5.5" onSubmit={handleSubmit}>
        <div className="relative">
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
        </div>

        <Button type="submit" size="lg" block>
          メールではじめる
        </Button>
      </form>

      <Button size="lg" block variant="outline">
        Google で続ける
      </Button>

      <p className="text-center text-xs font-medium text-muted">
        すでにアカウントをお持ちですか？{" "}
        <Link to="/login" className="font-semibold text-ink underline">
          ログイン
        </Link>
      </p>
    </AuthLayout>
  );
}
