import { Button, Card, CardLabel, PageHeader, cn } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { CENTURY } from "@/presentation/constants/reflectionContent";

const LEGEND = [
  { label: "すごした年", cls: "bg-ink" },
  { label: "いま", cls: "bg-brown" },
  { label: "これから", cls: "bg-track" },
];

export function CenturyPage() {
  usePageMeta("分析・つながり", "100年ライフ");
  const { age, total, stats, note, quote } = CENTURY;

  return (
    <>
      <PageHeader
        title="100年ライフ"
        description={`1マス = 1年。いま ${age}歳。残り ${total - age}マス。`}
        actions={
          <div className="flex flex-wrap gap-3">
            {LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2.75 rounded-[3px] border border-line-strong",
                    l.cls,
                  )}
                />
                <span className="text-[11px] font-semibold text-brown">
                  {l.label}
                </span>
              </span>
            ))}
          </div>
        }
      />

      <div className="flex w-full flex-1 flex-col gap-4.5 xl:flex-row">
        {/* セルは正方形。10行が縦に収まるよう、グリッド幅を上限で縛る */}
        <Card className="flex min-w-0 flex-1 flex-col items-center rounded-2xl p-5">
          <div className="flex w-full max-w-[520px] flex-col gap-2">
          {Array.from({ length: 10 }, (_, row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-5.5 shrink-0 text-right text-[10px] font-semibold text-muted">
                {row * 10}
              </span>
              {Array.from({ length: 10 }, (_, col) => {
                const value = row * 10 + col;
                const past = value < age;
                const now = value === age;
                return (
                  <span
                    key={col}
                    title={`${value}歳`}
                    className={cn(
                      "aspect-square min-h-4 flex-1 rounded-md border",
                      now
                        ? "border-2 border-ink bg-brown"
                        : past
                          ? "border-line bg-ink"
                          : "border-line bg-track",
                    )}
                  />
                );
              })}
            </div>
          ))}
          </div>
        </Card>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[320px]">
          <Card tone="ink" className="flex flex-col gap-2.5 p-4.5">
            <CardLabel className="text-nav-icon">いま ここ</CardLabel>
            <span className="flex items-end gap-1.5">
              <span className="text-[38px] leading-none font-bold text-paper">
                {age}
              </span>
              <span className="text-[13px] font-semibold text-nav-fg">
                歳 · {age + 1}マス目
              </span>
            </span>
            <p className="text-xs leading-[1.9] text-nav-fg">{note}</p>
          </Card>

          <Card tone="surface" className="flex flex-col gap-2.5 p-4.5">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-muted">
                  {s.label}
                </span>
                <span className="h-px flex-1" />
                <span className="text-xs font-bold text-ink">{s.value}</span>
              </div>
            ))}
          </Card>

          <Card className="flex flex-1 flex-col justify-center gap-2.5 p-4.5">
            <p className="text-sm leading-[1.9] font-bold text-ink">{quote}</p>
            <Button block className="h-10">
              このマスに名前をつける
            </Button>
          </Card>
        </aside>
      </div>
    </>
  );
}
