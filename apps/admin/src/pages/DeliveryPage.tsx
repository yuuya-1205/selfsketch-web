import { useState } from "react";
import { ChevronDown, Info, Plus } from "lucide-react";
import { Button, Card, CardLabel, PageHeader, cn } from "@selfsketch/ui";
import { Cell, DataTable, Pill, Row, StatusDot } from "@/components/Table";
import { CAMPAIGNS } from "@/lib/api/mock";

const COLUMNS = [
  { key: "name", label: "配信名" },
  { key: "channel", label: "チャネル", width: 88 },
  { key: "target", label: "対象", width: 104 },
  { key: "when", label: "配信日時", width: 100 },
  { key: "rate", label: "到達 / 開封", width: 112 },
  { key: "status", label: "状態", width: 84 },
];

const CHANNELS = ["プッシュ", "メール", "アプリ内"];

export function DeliveryPage() {
  const [channel, setChannel] = useState(CHANNELS[0]);

  return (
    <>
      <PageHeader
        title="配信・お知らせ"
        description="プッシュ / メール / アプリ内お知らせ · 週あたりの配信上限 2通（ユーザー設定を優先）"
        actions={
          <Button size="sm" icon={<Plus size={14} />}>
            新しい配信
          </Button>
        }
      />

      <div className="flex w-full flex-1 flex-col gap-3.5 xl:flex-row">
        <DataTable columns={COLUMNS} className="min-w-0 flex-1">
          {CAMPAIGNS.map((c) => (
            <Row key={c.name}>
              <Cell className="font-semibold">{c.name}</Cell>
              <Cell width={88}>
                <Pill>{c.channel}</Pill>
              </Cell>
              <Cell width={104}>{c.target}</Cell>
              <Cell width={100}>{c.when}</Cell>
              <Cell width={112}>{c.rate}</Cell>
              <Cell width={84}>
                <StatusDot tone={c.tone}>{c.status}</StatusDot>
              </Cell>
            </Row>
          ))}
        </DataTable>

        {/* ---- 作成パネル ---- */}
        <Card
          tone="surface"
          className="flex w-full shrink-0 flex-col gap-2.75 p-4 xl:w-[340px]"
        >
          <h2 className="text-xs font-bold text-ink">新しい配信を作成</h2>

          <div className="flex gap-1.5">
            {CHANNELS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChannel(c)}
                className={cn(
                  "h-8 flex-1 rounded-lg border text-[11px] font-semibold transition-colors",
                  c === channel
                    ? "border-ink bg-ink text-paper"
                    : "border-line-strong bg-paper text-brown",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <Field label="タイトル">
            <input
              defaultValue="3日空いた方へ"
              className="h-9 w-full rounded-lg border border-line-strong bg-paper px-2.75 text-[11px] font-medium text-ink focus:border-ink focus:outline-none"
            />
          </Field>

          <Field label="本文">
            <textarea
              rows={3}
              defaultValue="5分だけ、戻ってきませんか。あなたの未来の自分が待っています。"
              className="w-full resize-none rounded-lg border border-line-strong bg-paper p-2.5 text-[11px] leading-[1.6] text-ink focus:border-ink focus:outline-none"
            />
          </Field>

          <Field label="配信対象セグメント">
            <span className="flex h-9 items-center gap-2 rounded-lg border border-line-strong bg-paper px-2.75">
              <span className="flex-1 text-[11px] font-semibold text-ink">
                休眠 3–7日（推定 1,204人）
              </span>
              <ChevronDown size={13} className="text-muted" />
            </span>
          </Field>

          {/* プレビュー */}
          <div className="flex flex-col gap-1.75 rounded-[10px] bg-nav p-3">
            <span className="text-[9px] font-bold tracking-[1.1px] text-[#ad9068]">
              プレビュー（iOS プッシュ）
            </span>
            <div className="flex items-center gap-2.25 rounded-[9px] bg-paper p-2.5">
              <span className="grid size-6.5 shrink-0 place-items-center rounded-[7px] bg-ink text-[11px] font-bold text-paper">
                ◆
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[9px] font-semibold text-muted">
                  SelfSketch · いま
                </span>
                <span className="text-[11px] font-bold text-ink">
                  3日空いた方へ
                </span>
                <span className="truncate text-[10px] text-brown">
                  5分だけ、戻ってきませんか。
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-[9px] border border-warn bg-warn-bg p-2.75">
            <Info size={13} className="mt-0.5 shrink-0 text-warn" />
            <p className="text-[10px] leading-[1.6] font-medium text-[#7a4f22]">
              通知をオフにしているユーザー 214人には配信されません。深夜帯（22–7時）は自動で翌朝にずらします。
            </p>
          </div>

          <div className="mt-auto flex gap-2">
            <Button variant="outline" block size="sm">
              下書き保存
            </Button>
            <Button block size="sm">
              配信を予約
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.25">
      <CardLabel className="text-[10px]">{label}</CardLabel>
      {children}
    </label>
  );
}
