import { useState } from "react";
import { Button, Card, CardLabel, PageHeader, Switch } from "@selfsketch/ui";
import { Cell, DataTable, Pill, Row, StatusDot } from "@/components/Table";
import {
  ACCESS_POLICIES,
  MEMBERS,
  MEMBER_INVITES,
  ROLE_PERMISSIONS,
} from "@/lib/api/mock";

const MEMBER_COLUMNS = [
  { key: "member", label: "メンバー" },
  { key: "role", label: "ロール", width: 110 },
  { key: "login", label: "最終ログイン", width: 120 },
  { key: "mfa", label: "2段階認証", width: 90 },
  { key: "status", label: "状態", width: 110 },
];

const INVITE_COLUMNS = [
  { key: "email", label: "メールアドレス" },
  { key: "role", label: "予定ロール", width: 110 },
  { key: "expires", label: "期限", width: 120 },
  { key: "action", label: "", width: 90 },
];

export function MembersPage() {
  const [policies, setPolicies] = useState(() =>
    Object.fromEntries(ACCESS_POLICIES.map((p) => [p.key, p.on])),
  );

  return (
    <>
      <PageHeader
        title="権限・メンバー"
        description="管理コンソールにアクセスできるメンバーとロール。ロールの変更は Owner だけが行え、操作は監査ログに残ります。"
        actions={
          <>
            <Button variant="outline" size="sm">
              ロールを比較
            </Button>
            <Button size="sm">メンバーを招待</Button>
          </>
        }
      />

      <div className="flex flex-col gap-3.5 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <DataTable
            columns={MEMBER_COLUMNS}
            title={`メンバー (${MEMBERS.length})`}
          >
            {MEMBERS.map((m) => (
              <Row key={m.email}>
                <Cell className="flex items-center gap-2.25">
                  <span className="grid size-6.5 shrink-0 place-items-center rounded-full bg-line text-[11px] font-bold text-ink">
                    {m.name[0]}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold">{m.name}</span>
                    <span className="truncate text-[10px] text-muted">
                      {m.email}
                    </span>
                  </span>
                </Cell>
                <Cell width={110}>
                  <Pill tone={m.role === "Owner" ? "danger" : "track"}>
                    {m.role}
                  </Pill>
                </Cell>
                <Cell width={120} className="text-brown">
                  {m.lastLogin}
                </Cell>
                <Cell width={90}>
                  <Pill tone={m.mfa === "未設定" ? "danger" : "ok"}>
                    {m.mfa}
                  </Pill>
                </Cell>
                <Cell width={110}>
                  <StatusDot tone={m.tone}>{m.status}</StatusDot>
                </Cell>
              </Row>
            ))}
          </DataTable>

          <DataTable
            columns={INVITE_COLUMNS}
            title={`招待中 (${MEMBER_INVITES.length})`}
          >
            {MEMBER_INVITES.map((i) => (
              <Row key={i.email}>
                <Cell className="font-semibold">{i.email}</Cell>
                <Cell width={110}>
                  <Pill>{i.role}</Pill>
                </Cell>
                <Cell width={120} className="text-brown">
                  {i.expiresIn}
                </Cell>
                <Cell width={90}>
                  <button
                    type="button"
                    className="text-[11px] font-bold text-ink underline-offset-2 hover:underline"
                  >
                    再送
                  </button>
                </Cell>
              </Row>
            ))}
          </DataTable>
        </div>

        <div className="flex shrink-0 flex-col gap-3.5 xl:w-[340px]">
          <Card tone="ink" className="flex flex-col gap-2.25 p-4">
            <CardLabel className="text-nav-icon">ロールの権限</CardLabel>
            {ROLE_PERMISSIONS.map((r) => (
              <div
                key={r.role}
                className="flex flex-col gap-0.5 rounded-[9px] bg-admin-nav-active px-2.75 py-2.25"
              >
                <span className="flex items-center gap-2">
                  <span className="flex-1 text-[11px] font-bold text-paper">
                    {r.role}
                  </span>
                  <span className="text-[10px] font-semibold text-nav-icon">
                    {r.allowed}
                  </span>
                </span>
                <span className="text-[10px] leading-[1.6] text-nav-fg">
                  {r.description}
                </span>
              </div>
            ))}
          </Card>

          <Card className="flex flex-col gap-3 p-4">
            <CardLabel>アクセス制限</CardLabel>
            {ACCESS_POLICIES.map((p) => (
              <div key={p.key} className="flex items-center gap-3">
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-xs font-semibold text-ink">
                    {p.label}
                  </span>
                  <span className="text-[10px] text-muted">{p.note}</span>
                </span>
                <Switch
                  label={p.label}
                  checked={policies[p.key]}
                  onChange={(v) => setPolicies((s) => ({ ...s, [p.key]: v }))}
                />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
