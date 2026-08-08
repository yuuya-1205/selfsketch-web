import { useNavigate } from "react-router";
import { Moon } from "lucide-react";
import { Button, Card } from "@selfsketch/ui";
import {
  AuthKicker,
  AuthLayout,
  AuthTitle,
} from "@/components/layout/AuthLayout";

export function FutureSelfPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      step={3}
      stepLabel="STEP 3 / 4 — 未来の自分"
      title="1年後のあなた"
    >
      <AuthKicker>AI SKETCH</AuthKicker>
      <AuthTitle>1年後の、あなた</AuthTitle>

      <div className="grid h-60 w-full place-items-center overflow-hidden rounded-2xl border border-line-strong bg-track">
        <Moon size={28} className="text-brown" />
      </div>

      <Card tone="surface" className="flex flex-col gap-2.5 p-4.5">
        <p className="text-sm leading-[1.9] font-semibold text-ink">
          「毎朝の5分スケッチを 312日続けたあなた。ノート3冊分の線が、迷いのない一本になっている。」
        </p>
        <p className="text-[11px] text-muted">
          あなたの目標「1年後に作品集をつくる」から生成しました
        </p>
      </Card>

      <Button
        size="lg"
        block
        onClick={() => navigate("/onboarding/first-habit")}
      >
        この未来を保存して進む
      </Button>
      <Button size="lg" block variant="outline">
        描き直す
      </Button>
    </AuthLayout>
  );
}
