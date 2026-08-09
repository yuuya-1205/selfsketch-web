import { useState } from "react";
import { Button, Card, CardLabel, Chip, PageHeader } from "@selfsketch/ui";
import { Cell, DataTable, Pill, Row, StatusDot } from "@/components/Table";
import {
  AUDIT_FILTERS,
  AUDIT_LOGS,
  MEMBERS,
  ROLE_MATRIX,
} from "@/lib/api/mock";

const MEMBER_COLUMNS = [
  { key: "member", label: "メンバー" },
  { key: "role", label: "ロール", width: 100 },
  { key: "mfa", label: "2要素認証", width: 92 },
  { key: "login", label: "最終ログイン", width: 110 },
  { key: "status", label: "状態", width: 100 },
];

const LOG_COLUMNS = [
  { key: "time", label: "時刻", width: 110 },
  { key: "actor", label: "実行者", width: 120 },
  { key: "action", label: "操作" },
  { key: "target", label: "対象", width: 130 },
  { key: "ip", label: "IP", width: 110 },
  { key: "result", label: "結果", width: 72 },
];

export function AuditPage() {
  const [filter, setFilter] = useState(AUDIT_FILTERS[0]);

  return (
    <>
      <PageHeader
        title="監査ログ・権限"
        description="管理画面の操作はすべて記録されます。ログは 3年間 保持し、改ざん不可のストレージに保存。"
        actions={
          <>
            <Button variant="outline" size="sm">
              ログを書き出す
            </Button>
            <Button size="sm">メンバーを招待</Button>
          </>
        }
      />

      <div className="flex shrink-0 flex-col gap-3.5 xl:h-70 xl:flex-row">
        <DataTable columns={MEMBER_COLUMNS} className="min-w-0 flex-1">
          {MEMBERS.map((m) => (
            <Row key={m.name}>
              <Cell className="flex items-center gap-2.25">
                <span className="grid size-6.5 shrink-0 place-items-center rounded-full bg-line text-[11px] font-bold text-ink">
                  {m.name[0]}
                </span>
                <span className="min-w-0 truncate">{m.name}</span>
              </Cell>
              <Cell width={100}>
                <Pill tone={m.role === "Owner" ? "solid" : "track"}>
                  {m.role}
                </Pill>
              </Cell>
              <Cell
                width={92}
                className={m.mfa === "未設定" ? "text-warn" : undefined}
              >
                {m.mfa}
              </Cell>
              <Cell width={110}>{m.lastLogin}</Cell>
              <Cell width={100}>
                <StatusDot tone={m.tone}>{m.status}</StatusDot>
              </Cell>
            </Row>
          ))}
        </DataTable>

        <Card
          tone="ink"
          className="flex w-full shrink-0 flex-col gap-2.25 p-4 xl:w-[340px]"
        >
          <CardLabel className="text-[#ad9068]">ロールごとの権限</CardLabel>
          {ROLE_MATRIX.map((r) => (
            <div
              key={r.role}
              className="flex flex-col gap-0.5 rounded-[9px] bg-admin-nav-active px-2.75 py-2.25"
            >
              <span className="text-[11px] font-bold text-paper">{r.role}</span>
              <span className="text-[10px] leading-[1.6] text-nav-fg">
                {r.description}
              </span>
            </div>
          ))}
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xs font-bold text-ink">監査ログ</h2>
        {AUDIT_FILTERS.map((f) => (
          <Chip key={f} active={f === filter} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
        <span className="h-px flex-1" />
        <span className="text-[11px] font-medium text-muted">
          直近 24時間 · 128件
        </span>
      </div>

      <DataTable columns={LOG_COLUMNS} className="flex-1">
        {AUDIT_LOGS.map((l, i) => (
          <Row key={i}>
            <Cell width={110} className="font-semibold text-muted">
              {l.time}
            </Cell>
            <Cell width={120} className="font-semibold text-muted">
              {l.actor}
            </Cell>
            <Cell>{l.action}</Cell>
            <Cell width={130} className="text-brown">
              {l.target}
            </Cell>
            <Cell width={110} className="text-brown">
              {l.ip}
            </Cell>
            <Cell width={72}>
              <Pill
                tone={
                  l.tone === "ok" ? "ok" : l.tone === "warn" ? "warn" : "danger"
                }
              >
                {l.result}
              </Pill>
            </Cell>
          </Row>
        ))}
      </DataTable>
    </>
  );
}
