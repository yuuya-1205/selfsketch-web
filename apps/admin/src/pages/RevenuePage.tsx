import { TrendingDown, TrendingUp } from "lucide-react";
import { Button, Card, CardLabel, PageHeader, cn } from "@selfsketch/ui";
import { Cell, DataTable, Pill, Row } from "@/components/Table";
import {
  BILLING_ISSUES,
  CHURN_REASONS,
  MONTH_LABELS,
  MRR_SERIES,
  PLAN_MIX,
  REVENUE_KPIS,
} from "@/lib/api/mock";

const COLUMNS = [
  { key: "id", label: "ID", width: 88 },
  { key: "user", label: "ユーザー", width: 78 },
  { key: "detail", label: "内容" },
  { key: "amount", label: "金額", width: 84 },
  { key: "date", label: "日付", width: 64 },
  { key: "status", label: "状態", width: 84 },
];

const MAX_MRR = Math.max(...MRR_SERIES);
const MAX_CHURN = Math.max(...CHURN_REASONS.map((c) => c.count));

/** プラン内訳ドーナツ。conic-gradient で描く */
function planGradient() {
  let acc = 0;
  const stops = PLAN_MIX.map((p) => {
    const from = acc * 100;
    acc += p.ratio;
    return `${p.color} ${from}% ${acc * 100}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export function RevenuePage() {
  return (
    <>
      <PageHeader
        title="売上・課金"
        description="2026年4月（暫定）· 通貨: JPY · Stripe と同期済み 12分前"
        actions={
          <>
            <Button variant="outline" size="sm">
              Stripe を開く
            </Button>
            <Button size="sm">会計用にエクスポート</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
        {REVENUE_KPIS.map((k) => (
          <Card key={k.label} className="flex flex-col gap-1 p-3.5">
            <CardLabel className="text-[10px] tracking-[1.1px]">
              {k.label}
            </CardLabel>
            <span className="text-[21px] font-bold text-ink">{k.value}</span>
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

      <div className="flex min-h-60 flex-1 flex-col gap-3.5 xl:flex-row">
        <Card className="flex min-w-0 flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-ink">MRR 推移 · 直近12か月</h2>
            <span className="h-px flex-1" />
            <span className="text-[10px] font-semibold text-muted">
              目標 ¥4.0M / 月
            </span>
          </div>
          <ul className="flex flex-1 items-end justify-between gap-2.25">
            {MRR_SERIES.map((v, i) => (
              <li
                key={i}
                className="flex flex-1 flex-col items-center justify-end gap-1.25"
              >
                <span className="text-[8px] font-semibold text-muted">
                  {(v / 100).toFixed(2)}M
                </span>
                <span
                  className={cn(
                    "w-full rounded-[5px]",
                    i === MRR_SERIES.length - 1 ? "bg-ink" : "bg-brown",
                  )}
                  style={{ height: (v / MAX_MRR) * 150 }}
                />
                <span className="text-[9px] text-muted">{MONTH_LABELS[i]}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex w-full shrink-0 flex-col gap-3 xl:w-[330px]">
          <Card
            tone="surface"
            className="flex flex-col items-center gap-3 p-4"
          >
            <CardLabel className="self-start">プラン内訳 · 3,489人</CardLabel>
            <div
              className="relative grid size-32.5 place-items-center rounded-full"
              style={{ background: planGradient() }}
              role="img"
              aria-label="プラン内訳"
            >
              <div className="absolute grid size-[84px] place-items-center rounded-full bg-surface">
                <span className="text-[22px] leading-none font-bold text-ink">
                  12.2%
                </span>
                <span className="text-[10px] font-semibold text-muted">
                  課金率
                </span>
              </div>
            </div>
            {PLAN_MIX.map((p) => (
              <div key={p.label} className="flex w-full items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: p.color }}
                />
                <span className="flex-1 text-[11px] font-semibold text-ink">
                  {p.label}
                </span>
                <span className="text-[10px] text-muted">{p.detail}</span>
              </div>
            ))}
          </Card>

          <Card tone="ink" className="flex flex-1 flex-col gap-2.25 p-4">
            <CardLabel className="text-[#ad9068]">
              解約理由 · 今月 98件
            </CardLabel>
            {CHURN_REASONS.map((c) => (
              <div key={c.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-paper">
                    {c.label}
                  </span>
                  <span className="h-px flex-1" />
                  <span className="text-[10px] font-bold text-nav-fg">
                    {c.count}件
                  </span>
                </div>
                <span className="h-1.75 w-full overflow-hidden rounded-full bg-admin-nav-active">
                  <span
                    className="block h-full rounded-full bg-line"
                    style={{ width: `${(c.count / MAX_CHURN) * 100}%` }}
                  />
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        title="要対応の課金トラブル · 5件"
        action={
          <button
            type="button"
            className="text-[11px] font-semibold text-brown hover:text-ink"
          >
            すべて表示
          </button>
        }
        className="shrink-0"
      >
        {BILLING_ISSUES.map((b) => (
          <Row key={b.id}>
            <Cell width={88} className="font-semibold">
              {b.id}
            </Cell>
            <Cell width={78}>{b.user}</Cell>
            <Cell>{b.detail}</Cell>
            <Cell width={84} className="text-brown">
              {b.amount}
            </Cell>
            <Cell width={64} className="text-brown">
              {b.date}
            </Cell>
            <Cell width={84}>
              <Pill tone={b.tone === "ok" ? "ok" : b.tone === "warn" ? "warn" : "danger"}>
                {b.status}
              </Pill>
            </Cell>
          </Row>
        ))}
      </DataTable>
    </>
  );
}
