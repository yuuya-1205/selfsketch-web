import { Check, ChevronRight, Circle, Sparkles } from "lucide-react";
import { Button, Card, CardLabel, PageHeader, cn } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import {
  BACKCAST_STEPS,
  WEEK_TASKS,
} from "@/presentation/constants/reflectionContent";

export function BackcastPage() {
  usePageMeta("分析・つながり", "逆算プラン");

  return (
    <>
      <PageHeader
        title="10年後から、今日まで逆算する"
        description="右へ行くほど「今日できること」に近づきます。"
        actions={
          <Button icon={<Sparkles size={14} />}>AIに分解してもらう</Button>
        }
      />

      <div className="flex flex-1 items-stretch overflow-x-auto">
        <div className="flex min-w-[900px] flex-1 items-stretch">
          {BACKCAST_STEPS.map((s, i) => (
            <div key={s.horizon} className="flex flex-1 items-stretch">
              <Card
                tone={s.primary ? "ink" : "paper"}
                className="flex flex-1 flex-col gap-3 p-4.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-base font-bold",
                      s.primary ? "text-paper" : "text-ink",
                    )}
                  >
                    {s.horizon}
                  </span>
                  <span className="h-px flex-1" />
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      s.primary ? "text-nav-icon" : "text-muted",
                    )}
                  >
                    {s.year}
                  </span>
                </div>

                <p
                  className={cn(
                    "text-sm leading-[1.7] font-bold",
                    s.primary ? "text-line" : "text-ink",
                  )}
                >
                  {s.goal}
                </p>

                <ul className="flex flex-col gap-2">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "flex gap-2 rounded-[9px] px-3 py-2.5",
                        s.primary ? "bg-nav-card" : "bg-surface",
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-bold",
                          s.primary ? "text-nav-icon" : "text-line-strong",
                        )}
                      >
                        ·
                      </span>
                      <span
                        className={cn(
                          "text-xs leading-[1.6] font-medium",
                          s.primary ? "text-paper" : "text-ink",
                        )}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              {i < BACKCAST_STEPS.length - 1 && (
                <div className="grid w-11 shrink-0 place-items-center">
                  <ChevronRight size={20} className="text-line-strong" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Card
        tone="surface"
        className="flex flex-col gap-4 p-4.5 sm:flex-row sm:items-center"
      >
        <CardLabel>今週やること</CardLabel>
        <div className="flex flex-wrap gap-2.5">
          {WEEK_TASKS.map((t) => (
            <span
              key={t.label}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-semibold",
                t.done
                  ? "border-ink bg-ink text-paper"
                  : "border-line-strong bg-paper text-brown",
              )}
            >
              {t.done ? <Check size={13} /> : <Circle size={13} />}
              {t.label}
            </span>
          ))}
        </div>
      </Card>
    </>
  );
}
