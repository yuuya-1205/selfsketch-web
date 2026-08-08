import { Card, CardLabel, cn } from "@selfsketch/ui";
import { ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";

const KPIS = [
  { label: "DAU", value: "4,182", delta: "+6.2%", up: true },
  { label: "WAU", value: "11,940", delta: "+3.8%", up: true },
  { label: "MAU", value: "28,610", delta: "+1.4%", up: true },
  { label: "新規登録", value: "312", delta: "-8.1%", up: false },
  { label: "D7継続率", value: "41.6%", delta: "+2.2pt", up: true },
  { label: "MRR", value: "¥3.42M", delta: "+4.9%", up: true },
];

export function OverviewPage() {
  return (
    <>
      <Card
        tone="paper"
        className="flex items-center gap-2.5 border-danger bg-danger-bg px-3.5 py-3"
      >
        <ShieldAlert size={15} className="shrink-0 text-danger" />
        <span className="flex-1 text-xs font-semibold text-ink">
          未処理の通報が 12件（うち緊急 2件）
        </span>
        <button
          type="button"
          className="rounded-lg bg-danger px-2.5 py-1.5 text-[11px] font-bold text-paper"
        >
          対応する
        </button>
      </Card>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => (
          <Card key={k.label} className="flex flex-col gap-1 p-3.5">
            <CardLabel className="text-[10px] tracking-[1.2px]">
              {k.label}
            </CardLabel>
            <span className="text-2xl font-bold text-ink">{k.value}</span>
            <span
              className={cn(
                "flex items-center gap-1 text-[11px] font-semibold",
                k.up ? "text-ok" : "text-danger",
              )}
            >
              {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {k.delta}
            </span>
          </Card>
        ))}
      </div>

      <Card
        tone="surface"
        className="grid flex-1 place-items-center border-dashed p-10 text-center"
      >
        <div className="flex max-w-md flex-col gap-2">
          <p className="text-base font-bold text-ink">
            グラフ・ファネル・イベントログはこれから
          </p>
          <p className="text-xs leading-relaxed text-brown">
            デザインは selfsketch.pen の「Admin Console (Web) - SelfSketch /
            Adm 1」に揃っています。集計APIの形が決まり次第、この下に差し込みます。
          </p>
        </div>
      </Card>
    </>
  );
}
