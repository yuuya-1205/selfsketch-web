import { useState } from "react";
import { Card, CardLabel, PageHeader, Segmented, cn } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { COMPARISON, COMPARISON_DELTAS } from "@/lib/api/reflection";

const RANGES = ["1か月", "3か月", "6か月", "1年"] as const;

export function ComparisonPage() {
  usePageMeta("分析・つながり", "6か月前と比べる");
  const [range, setRange] = useState<(typeof RANGES)[number]>("6か月");

  return (
    <>
      <PageHeader
        title="6か月前の自分と比べる"
        actions={
          <Segmented options={RANGES} value={range} onChange={setRange} />
        }
      />

      <div className="flex w-full flex-1 flex-col gap-4 lg:flex-row">
        {COMPARISON.map((side, i) => {
          const dark = i === 1;
          return (
            <Card
              key={side.label}
              tone={dark ? "ink" : "paper"}
              className="flex flex-1 flex-col gap-3.5 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[11px] font-bold tracking-[1.4px]",
                    dark ? "text-nav-icon" : "text-muted",
                  )}
                >
                  {side.label}
                </span>
                <span className="h-px flex-1" />
                <span
                  className={cn(
                    "text-xs font-bold",
                    dark ? "text-paper" : "text-ink",
                  )}
                >
                  {side.dateLabel}
                </span>
              </div>

              <div
                className={cn(
                  "min-h-40 flex-1 rounded-xl",
                  dark ? "bg-nav-active" : "bg-[#e0cba8]",
                )}
              />

              <div className="flex gap-2.5">
                {side.stats.map((s) => (
                  <div
                    key={s.label}
                    className={cn(
                      "flex flex-1 flex-col gap-0.5 rounded-[10px] px-3 py-2.5",
                      dark ? "bg-nav-card" : "bg-surface",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] font-semibold tracking-[0.8px]",
                        dark ? "text-nav-icon" : "text-muted",
                      )}
                    >
                      {s.label}
                    </span>
                    <span
                      className={cn(
                        "text-[17px] font-bold",
                        dark ? "text-paper" : "text-ink",
                      )}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              <p
                className={cn(
                  "text-[13px] leading-[1.9] font-semibold",
                  dark ? "text-line" : "text-brown",
                )}
              >
                {side.quote}
              </p>
            </Card>
          );
        })}
      </div>

      <Card
        tone="surface"
        className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <CardLabel>6か月で変わったこと</CardLabel>
          <p className="text-[13px] leading-[1.9] font-medium text-ink">
            記録日数は 4.3倍、途切れてから再開するまでの日数は平均 6.2日 → 1.1日
            に短くなりました。「やめない」から「すぐ戻る」に変わっています。
          </p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          {COMPARISON_DELTAS.map((d) => (
            <div
              key={d.label}
              className="flex flex-col items-center gap-0.5 rounded-[11px] border border-line-strong bg-paper px-4 py-3"
            >
              <span className="text-[10px] font-semibold text-muted">
                {d.label}
              </span>
              <span className="text-[17px] font-bold text-ink">{d.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
