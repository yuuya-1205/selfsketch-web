import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, CheckCircle, cn } from "@selfsketch/ui";
import {
  AuthBody,
  AuthKicker,
  AuthLayout,
  AuthTitle,
} from "@/components/layout/AuthLayout";
import { useCompleteOnboarding } from "@/usecase/auth";

const CANDIDATES = [
  { id: "c1", title: "5分スケッチ", meta: "毎朝 7:00 · 5分" },
  { id: "c2", title: "朝のストレッチ", meta: "起床後 · 3分" },
  { id: "c3", title: "1日1ページ読書", meta: "就寝前 · 10分" },
  { id: "c4", title: "夜のリフレクション", meta: "就寝前 · 3分" },
];

export function FirstHabitPage() {
  const navigate = useNavigate();
  const completeOnboarding = useCompleteOnboarding();
  const [selected, setSelected] = useState("c1");
  const [isStarting, setIsStarting] = useState(false);

  // 完了を記録してから「今日」へ。次回のログインはオンボーディングを飛ばす
  async function handleStart() {
    if (isStarting) return;
    setIsStarting(true);
    await completeOnboarding();
    navigate("/today", { replace: true });
  }

  return (
    <AuthLayout
      step={4}
      stepLabel="STEP 4 / 4 — 最初の習慣"
      title="最初の習慣"
    >
      <AuthKicker>FIRST HABIT</AuthKicker>
      <AuthTitle>最初の習慣を ひとつだけ</AuthTitle>
      <AuthBody>
        欲張らないのがコツ。慣れてきたらWebの「今日」画面からいつでも追加できます。
      </AuthBody>

      <div className="flex flex-col gap-2.5">
        {CANDIDATES.map((c) => {
          const on = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3.5 py-3.5 text-left transition-colors",
                on
                  ? "border-[1.5px] border-ink bg-surface"
                  : "border border-line-strong bg-paper hover:bg-surface",
              )}
            >
              <CheckCircle checked={on} />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-ink">{c.title}</span>
                <span className="text-[11px] text-muted">{c.meta}</span>
              </span>
            </button>
          );
        })}
      </div>

      <Button size="lg" block onClick={handleStart} disabled={isStarting}>
        {isStarting ? "準備中…" : "はじめる"}
      </Button>
    </AuthLayout>
  );
}
