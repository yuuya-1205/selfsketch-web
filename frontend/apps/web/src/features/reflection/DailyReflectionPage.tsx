import { useState } from "react";
import { Button, Card, CardLabel, Textarea, cn } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { DAILY_QUESTIONS } from "@/presentation/constants/reflectionContent";

const TIPS = [
  "「よかった」より「意外だった」を探す",
  "感情ではなく、行動を1つ書く",
  "3文字でもいい。空欄でなければいい",
];

export function DailyReflectionPage() {
  usePageMeta("分析・つながり", "今日のリフレクション");
  const [answers, setAnswers] = useState(
    DAILY_QUESTIONS.map((q) => q.answer),
  );

  return (
    <div className="flex w-full flex-1 flex-col gap-5 xl:flex-row">
      <section className="flex min-w-0 flex-1 flex-col gap-3.5">
        <header className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-[1.2px] text-muted">
            2026年4月22日 (火) · 3分で終わります
          </span>
          <h2 className="text-[26px] leading-none font-bold text-ink">
            今日をふりかえる
          </h2>
        </header>

        {DAILY_QUESTIONS.map((q, i) => {
          const filled = answers[i].length > 0;
          return (
            <Card
              key={q.no}
              tone={filled ? "paper" : "outline"}
              className={cn("flex flex-col gap-2.5 p-4.5", !filled && "bg-surface")}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[1.2px] text-muted">
                  {q.no}
                </span>
                <span className="text-sm font-bold text-ink">{q.question}</span>
              </div>
              <Textarea
                rows={filled ? 2 : 3}
                value={answers[i]}
                placeholder="ここに書く…"
                onChange={(e) =>
                  setAnswers((prev) =>
                    prev.map((a, ai) => (ai === i ? e.target.value : a)),
                  )
                }
                className={cn("text-[13px]", filled ? "bg-surface" : "bg-paper")}
              />
            </Card>
          );
        })}

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex-1 text-[11px] font-medium text-muted">
            保存すると、6か月後の比較ビューに自動で並びます。
          </span>
          <Button size="lg">今日を締めくくる</Button>
        </div>
      </section>

      <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[330px]">
        <Card tone="surface" className="flex flex-col gap-2.5 p-4.5">
          <CardLabel>前回のふりかえり · 4月21日</CardLabel>
          <p className="text-[13px] leading-[1.9] font-semibold text-ink">
            「描けない日にこそ、机に座る意味がある気がした。」
          </p>
        </Card>

        <Card tone="ink" className="flex flex-col gap-2.5 p-4.5">
          <CardLabel className="text-nav-icon">1年前の今日</CardLabel>
          <p className="text-[13px] leading-[1.9] font-semibold text-paper">
            「毎日描くなんて無理だと思う。3日で終わりそう。」
          </p>
          <span className="text-[11px] text-nav-label">
            — 2025年4月22日のあなた
          </span>
        </Card>

        <Card className="flex flex-1 flex-col gap-2.5 p-4.5">
          <CardLabel>書けないときのヒント</CardLabel>
          {TIPS.map((t) => (
            <span key={t} className="flex gap-2">
              <span className="text-xs font-bold text-line-strong">—</span>
              <span className="text-xs leading-[1.7] font-medium text-brown">
                {t}
              </span>
            </span>
          ))}
        </Card>
      </aside>
    </div>
  );
}
