import { TriangleAlert } from "lucide-react";
import { Button, Card, CardLabel, PageHeader, cn } from "@selfsketch/ui";
import { Cell, DataTable, Pill, Row } from "@/components/Table";
import {
  AI_FAIL_REASONS,
  AI_HOURLY,
  AI_HOURLY_FAIL,
  AI_KPIS,
  AI_MODELS,
  AI_SAFETY,
} from "@/lib/api/mock";

const COLUMNS = [
  { key: "model", label: "モデル / 用途" },
  { key: "req", label: "リクエスト", width: 100 },
  { key: "rate", label: "成功率", width: 80 },
  { key: "p95", label: "p95", width: 70 },
  { key: "unit", label: "単価", width: 70 },
  { key: "cost", label: "コスト", width: 100 },
  { key: "status", label: "状態", width: 84 },
];

const MAX = Math.max(...AI_HOURLY);

export function AiMonitoringPage() {
  return (
    <>
      <PageHeader
        title="AI 生成モニタリング"
        description="未来の自分の画像生成・物語生成・レポート要約の稼働状況とコスト"
        actions={
          <span className="flex items-center gap-1.75 rounded-[9px] border border-warn bg-warn-bg px-3 py-2">
            <TriangleAlert size={14} className="text-warn" />
            <span className="text-[11px] font-bold text-[#7a4f22]">
              失敗率が閾値超過（4.2% / 3.0%）
            </span>
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
        {AI_KPIS.map((k) => (
          <Card key={k.label} className="flex flex-col gap-0.75 p-3.5">
            <CardLabel className="text-[10px] tracking-[1.1px]">
              {k.label}
            </CardLabel>
            <span
              className={cn(
                "text-[22px] font-bold",
                k.tone === "warn"
                  ? "text-warn"
                  : k.tone === "ok"
                    ? "text-ok"
                    : "text-ink",
              )}
            >
              {k.value}
            </span>
            <span className="text-[10px] text-muted">{k.note}</span>
          </Card>
        ))}
      </div>

      <div className="flex min-h-60 flex-1 flex-col gap-3.5 xl:flex-row">
        <Card className="flex min-w-0 flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xs font-bold text-ink">
              時間帯別の生成数 · 直近24時間
            </h2>
            <span className="h-px flex-1" />
            {[
              { label: "成功", cls: "bg-ink" },
              { label: "失敗", cls: "bg-danger" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={cn("size-2.25 rounded-[3px]", l.cls)} />
                <span className="text-[10px] font-semibold text-muted">
                  {l.label}
                </span>
              </span>
            ))}
          </div>
          <ul className="flex flex-1 items-end justify-between gap-1.5">
            {AI_HOURLY.map((v, i) => (
              <li
                key={i}
                className="flex flex-1 flex-col items-center justify-end gap-0.5"
              >
                <span
                  className="w-full rounded-[3px] bg-danger"
                  style={{ height: Math.max(2, AI_HOURLY_FAIL[i] * 3.4) }}
                />
                <span
                  className={cn(
                    "w-full rounded-[3px]",
                    i >= 19 && i <= 21 ? "bg-brown" : "bg-ink",
                  )}
                  style={{ height: (v / MAX) * 150 }}
                />
                {i % 4 === 0 && (
                  <span className="text-[8px] text-muted">{i}</span>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex w-full shrink-0 flex-col gap-3 xl:w-[340px]">
          <Card tone="surface" className="flex flex-col gap-2.5 p-4">
            <CardLabel>失敗の内訳 · 774件</CardLabel>
            {AI_FAIL_REASONS.map((r) => (
              <div key={r.label} className="flex flex-col gap-1.25">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-ink">
                    {r.label}
                  </span>
                  <span className="h-px flex-1" />
                  <span className="text-[10px] font-bold text-brown">
                    {r.count}件 · {Math.round(r.rate * 100)}%
                  </span>
                </div>
                <span className="h-2 w-full overflow-hidden rounded-full bg-track">
                  <span
                    className={cn(
                      "block h-full rounded-full",
                      r.tone === "danger"
                        ? "bg-danger"
                        : r.tone === "warn"
                          ? "bg-warn"
                          : "bg-brown",
                    )}
                    style={{ width: `${r.rate * 100}%` }}
                  />
                </span>
              </div>
            ))}
          </Card>

          <Card className="flex flex-1 flex-col gap-2.25 p-4">
            <CardLabel>安全フィルタのブロック内訳</CardLabel>
            {AI_SAFETY.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-ink">
                  {s.label}
                </span>
                <span className="h-px flex-1" />
                <span className="text-[11px] font-bold text-brown">
                  {s.count}
                </span>
              </div>
            ))}
            <Button variant="outline" block size="sm" className="mt-auto">
              ブロック事例をレビューする
            </Button>
          </Card>
        </div>
      </div>

      <DataTable columns={COLUMNS} className="shrink-0">
        {AI_MODELS.map((m) => (
          <Row key={m.name}>
            <Cell className="font-semibold">{m.name}</Cell>
            <Cell width={100}>{m.requests}</Cell>
            <Cell width={80}>{m.rate}</Cell>
            <Cell width={70}>{m.p95}</Cell>
            <Cell width={70}>{m.unit}</Cell>
            <Cell width={100}>{m.cost}</Cell>
            <Cell width={84}>
              <Pill tone={m.tone === "ok" ? "ok" : "warn"}>{m.status}</Pill>
            </Cell>
          </Row>
        ))}
      </DataTable>
    </>
  );
}
