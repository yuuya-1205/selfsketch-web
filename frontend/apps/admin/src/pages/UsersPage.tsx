import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { Button, Chip, PageHeader, cn } from "@selfsketch/ui";
import { Cell, DataTable, Pill, Row, StatusDot } from "@/components/Table";
import { USER_FILTERS, USERS } from "@/lib/api/mock";

const COLUMNS = [
  { key: "check", label: "", width: 30 },
  { key: "user", label: "ユーザー" },
  { key: "plan", label: "プラン", width: 92 },
  { key: "registered", label: "登録日", width: 92 },
  { key: "last", label: "最終記録", width: 100 },
  { key: "streak", label: "連続", width: 60 },
  { key: "records", label: "記録数", width: 72 },
  { key: "status", label: "状態", width: 92 },
  { key: "menu", label: "", width: 30 },
];

const SELECTS = ["プラン: すべて", "登録: 全期間", "並び: 最終記録が新しい順"];

export function UsersPage() {
  const [filter, setFilter] = useState(USER_FILTERS[0]);
  const [selected, setSelected] = useState<string[]>([USERS[0].id]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  return (
    <>
      <PageHeader
        title="ユーザー"
        description="28,610人（アクティブ 11,940 / 休眠 14,382 / 停止 88）"
        actions={
          <>
            <Button variant="outline" size="sm">
              セグメント保存
            </Button>
            <Button size="sm">CSV書き出し</Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {USER_FILTERS.map((f) => (
          <Chip key={f} active={f === filter} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
        <span className="h-px flex-1" />
        {SELECTS.map((s) => (
          <span
            key={s}
            className="flex h-8 items-center gap-1.5 rounded-[9px] border border-line-strong bg-surface px-2.75 text-[11px] font-semibold text-ink"
          >
            {s}
            <ChevronDown size={12} className="text-muted" />
          </span>
        ))}
      </div>

      <DataTable columns={COLUMNS} className="flex-1">
        {USERS.map((u) => {
          const on = selected.includes(u.id);
          return (
            <Row key={u.id} selected={on}>
              <Cell width={30}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  aria-label={`${u.name} を選択`}
                  onClick={() => toggle(u.id)}
                  className={cn(
                    "size-3.75 rounded border-[1.5px] border-line-strong",
                    on && "border-ink bg-ink",
                  )}
                />
              </Cell>

              <Cell className="flex items-center gap-2.25">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-line text-[11px] font-bold text-ink">
                  {u.initial}
                </span>
                <span className="flex min-w-0 flex-col">
                  <Link
                    to={`/users/${u.id}`}
                    className="truncate text-xs font-semibold text-ink hover:underline"
                  >
                    {u.name}
                  </Link>
                  <span className="truncate text-[10px] text-muted">
                    {u.email}
                  </span>
                </span>
              </Cell>

              <Cell width={92}>
                <Pill tone={u.plan === "Premium" ? "solid" : "track"}>
                  {u.plan}
                </Pill>
              </Cell>
              <Cell width={92}>{u.registered}</Cell>
              <Cell width={100}>{u.lastRecord}</Cell>
              <Cell width={60}>{u.streak}</Cell>
              <Cell width={72}>{u.records}</Cell>
              <Cell width={92}>
                <StatusDot tone={u.tone}>{u.status}</StatusDot>
              </Cell>
              <Cell width={30}>
                <Ellipsis size={15} className="text-muted" />
              </Cell>
            </Row>
          );
        })}
      </DataTable>

      <div className="flex shrink-0 flex-wrap items-center gap-2.5 rounded-[13px] border border-line-strong bg-surface px-4 py-3">
        <span className="text-[11px] font-semibold text-brown">
          {selected.length}件を選択中
        </span>
        <Button variant="outline" size="sm">
          メールを送る
        </Button>
        <Button variant="outline" size="sm">
          Premium 付与
        </Button>
        <Button variant="danger" size="sm">
          一時停止
        </Button>
        <span className="h-px flex-1" />
        <span className="text-[11px] text-muted">1–10 / 28,610</span>
        {[ChevronLeft, ChevronRight].map((Icon, i) => (
          <button
            key={i}
            type="button"
            aria-label={i === 0 ? "前のページ" : "次のページ"}
            className="grid size-7 place-items-center rounded-lg border border-line-strong bg-paper text-brown"
          >
            <Icon size={14} />
          </button>
        ))}
      </div>
    </>
  );
}
