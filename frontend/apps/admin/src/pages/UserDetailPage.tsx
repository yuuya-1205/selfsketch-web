import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { EyeOff } from "lucide-react";
import {
  BackLink,
  Button,
  Card,
  CardLabel,
  Heatmap,
  Tabs,
  mockHeatmap,
  cn,
} from "@selfsketch/ui";
import { Pill } from "@/components/Table";
import { USERS, USER_DETAIL } from "@/lib/api/mock";

const TABS = ["概要", "記録アクティビティ", "課金履歴", "サポート", "監査ログ"] as const;
const HEATMAP = mockHeatmap(12);

export function UserDetailPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = USERS.find((u) => u.id === userId) ?? USERS[0];
  const [tab, setTab] = useState<(typeof TABS)[number]>("概要");

  return (
    <>
      <BackLink onClick={() => navigate("/users")}>
        ユーザー一覧にもどる
      </BackLink>

      <header className="flex flex-wrap items-center gap-3.5">
        <span className="grid size-13 shrink-0 place-items-center rounded-full bg-line text-xl font-bold text-ink">
          {user.initial}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-ink">{user.name}</h1>
            <Pill tone={user.plan === "Premium" ? "solid" : "track"}>
              {user.plan}
            </Pill>
            <Pill tone="ok">{user.status}</Pill>
            <Pill tone="track">通報 0件</Pill>
          </div>
          <span className="text-[11px] font-medium text-muted">
            {user.email} · {user.id} · {user.registered} 登録
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">メールを送る</Button>
          <Button variant="outline" size="sm">Premium を付与</Button>
          <Button variant="outline" size="sm">データ書き出し</Button>
          <Button variant="danger" size="sm">一時停止</Button>
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col gap-3.5 xl:flex-row">
        {/* ---- 左：属性 ---- */}
        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[320px]">
          <Card className="flex flex-col gap-2.25 p-3.75">
            <CardLabel>基本情報</CardLabel>
            {USER_DETAIL.profile.map(([k, v]) => (
              <KV key={k} k={k} v={v} />
            ))}
          </Card>

          <Card className="flex flex-col gap-2.25 p-3.75">
            <CardLabel>課金</CardLabel>
            {USER_DETAIL.billing.map(([k, v]) => (
              <KV key={k} k={k} v={v} />
            ))}
            <KV k="決済状態" v="正常" tone="ok" />
          </Card>

          <Card className="flex flex-col gap-2.25 p-3.75">
            <CardLabel>端末・セッション</CardLabel>
            {USER_DETAIL.devices.map((d) => (
              <div key={d.name} className="flex items-center gap-2.25">
                <span
                  className={cn(
                    "size-1.75 shrink-0 rounded-full",
                    d.active ? "bg-ok" : "bg-line-strong",
                  )}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[11px] font-semibold text-ink">
                    {d.name}
                  </span>
                  <span className="truncate text-[10px] text-muted">
                    {d.meta}
                  </span>
                </span>
                <button
                  type="button"
                  className="shrink-0 text-[10px] font-semibold text-brown hover:text-ink"
                >
                  ログアウト
                </button>
              </div>
            ))}
          </Card>
        </aside>

        {/* ---- 右：タブ ---- */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Tabs options={TABS} value={tab} onChange={setTab} />

          <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-6">
            {USER_DETAIL.stats.map((s) => (
              <Card key={s.label} tone="surface" className="flex flex-col gap-0.5 px-3.25 py-3">
                <span className="text-[10px] font-semibold tracking-[1px] text-muted">
                  {s.label}
                </span>
                <span className="text-lg font-bold text-ink">{s.value}</span>
              </Card>
            ))}
          </div>

          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-ink">直近12週の記録状況</h2>
              <span className="h-px flex-1" />
              <span className="text-[10px] font-semibold text-muted">
                達成率 86% · 記録本文は非表示
              </span>
            </div>
            <div className="overflow-x-auto">
              <Heatmap weeks={HEATMAP} cell={16} />
            </div>

            {/* 設計メモ「記録本文は既定でマスク」に対応する UI */}
            <div className="flex flex-wrap items-center gap-2.5 rounded-[10px] bg-surface p-3">
              <EyeOff size={14} className="shrink-0 text-brown" />
              <p className="min-w-0 flex-1 text-[11px] leading-[1.7] font-medium text-brown">
                ジャーナル本文・作品画像は管理画面では既定でマスクされます。通報対応時のみ「開示リクエスト」を作成し、承認後に監査ログ付きで閲覧できます。
              </p>
              <Button variant="outline" size="sm">
                開示をリクエスト
              </Button>
            </div>
          </Card>

          <Card className="flex flex-1 flex-col gap-2.25 p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-ink">サポート履歴</h2>
              <span className="h-px flex-1" />
              <button
                type="button"
                className="text-[11px] font-semibold text-brown hover:text-ink"
              >
                チケットを作成
              </button>
            </div>
            {USER_DETAIL.support.map((s) => (
              <div key={s.date} className="flex items-center gap-3">
                <span className="w-22 shrink-0 text-[11px] font-semibold text-muted">
                  {s.date}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-ink">
                  {s.title}
                </span>
                <Pill tone={s.tone === "ok" ? "ok" : "warn"}>{s.status}</Pill>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

function KV({ k, v, tone }: { k: string; v: string; tone?: "ok" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted">{k}</span>
      <span className="h-px flex-1" />
      <span
        className={cn(
          "truncate text-[11px] font-bold",
          tone === "ok" ? "text-ok" : "text-ink",
        )}
      >
        {v}
      </span>
    </div>
  );
}
