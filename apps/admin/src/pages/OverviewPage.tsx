import { Link } from "react-router";
import {
  CreditCard,
  Cpu,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  UserSearch,
  Send,
  Download,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardLabel, cn } from "@selfsketch/ui";
import { ALERTS, DAU_SERIES, EVENTS, FUNNEL, KPIS } from "@/lib/api/mock";

const ALERT_ICONS: Record<string, LucideIcon> = {
  "shield-alert": ShieldAlert,
  cpu: Cpu,
  "credit-card": CreditCard,
};

const QUICK_ACTIONS = [
  { icon: ShieldAlert, label: "通報キューを開く", to: "/moderation" },
  { icon: UserSearch, label: "ユーザーを検索", to: "/users" },
  { icon: Send, label: "お知らせを配信", to: "/delivery" },
  { icon: Download, label: "データを書き出す", to: "/audit" },
];

const MAX_DAU = Math.max(...DAU_SERIES);

export function OverviewPage() {
  return (
    <>
      {/* ---- アラート ---- */}
      <div className="flex flex-col gap-2.5 lg:flex-row">
        {ALERTS.map((a) => {
          const Icon = ALERT_ICONS[a.icon] ?? ShieldAlert;
          const danger = a.tone === "danger";
          return (
            <Card
              key={a.label}
              className={cn(
                "flex flex-1 items-center gap-2.5 px-3.5 py-2.75",
                danger ? "border-danger bg-danger-bg" : "border-warn bg-warn-bg",
              )}
            >
              <Icon
                size={15}
                className={cn("shrink-0", danger ? "text-danger" : "text-warn")}
              />
              <span className="flex-1 text-xs font-semibold text-ink">
                {a.label}
              </span>
              <Link
                to={a.to}
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-paper",
                  danger ? "bg-danger" : "bg-warn",
                )}
              >
                {a.cta}
              </Link>
            </Card>
          );
        })}
      </div>

      {/* ---- KPI ---- */}
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

      {/* ---- グラフ + ファネル ---- */}
      <div className="flex min-h-70 flex-1 flex-col gap-3.5 xl:flex-row">
        <Card className="flex min-w-0 flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xs font-bold text-ink">DAU 推移 · 直近30日</h2>
            <span className="h-px flex-1" />
            {[
              { label: "DAU", cls: "bg-ink" },
              { label: "記録した人", cls: "bg-ok" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={cn("size-2.25 rounded-[3px]", l.cls)} />
                <span className="text-[10px] font-semibold text-muted">
                  {l.label}
                </span>
              </span>
            ))}
          </div>
          <ul className="flex flex-1 items-end justify-between gap-[5px]">
            {DAU_SERIES.map((v, i) => (
              <li
                key={i}
                className="flex flex-1 flex-col items-center justify-end gap-[3px]"
              >
                <span
                  className={cn(
                    "w-full rounded-[3px]",
                    i === DAU_SERIES.length - 1 ? "bg-warn" : "bg-ink",
                  )}
                  style={{ height: (v / MAX_DAU) * 150 }}
                />
                <span
                  className="w-full rounded-[3px] bg-ok"
                  style={{ height: (v / MAX_DAU) * 64 }}
                />
                {i % 7 === 0 && (
                  <span className="text-[8px] text-muted">{i + 1}</span>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card
          tone="surface"
          className="flex w-full shrink-0 flex-col gap-3 p-4 xl:w-[330px]"
        >
          <h2 className="text-xs font-bold text-ink">
            オンボーディング ファネル · 今月
          </h2>
          {FUNNEL.map((f) => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-ink">
                  {f.label}
                </span>
                <span className="h-px flex-1" />
                <span className="text-[11px] font-bold text-brown">
                  {f.count}
                </span>
                <span className="text-[10px] text-muted">
                  {Math.round(f.rate * 100)}%
                </span>
              </div>
              <span className="h-2.25 w-full overflow-hidden rounded-full bg-track">
                <span
                  className={cn(
                    "block h-full rounded-full",
                    f.rate >= 0.67 ? "bg-ink" : f.rate >= 0.5 ? "bg-brown" : "bg-warn",
                  )}
                  style={{ width: `${f.rate * 100}%` }}
                />
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* ---- イベント + よく使う操作 ---- */}
      <div className="flex shrink-0 flex-col gap-3.5 xl:h-62 xl:flex-row">
        <Card className="flex min-w-0 flex-1 flex-col overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
            <span className="text-xs font-bold text-ink">直近のイベント</span>
            <span className="h-px flex-1" />
            <Link
              to="/audit"
              className="text-[11px] font-semibold text-brown hover:text-ink"
            >
              監査ログをすべて見る
            </Link>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {EVENTS.map((e) => (
              <li
                key={e.time}
                className="flex items-center gap-3 border-b border-line px-4 py-2.75 last:border-0"
              >
                <span className="w-11 shrink-0 text-[11px] font-semibold text-muted">
                  {e.time}
                </span>
                <span
                  className={cn(
                    "size-1.75 shrink-0 rounded-full",
                    e.tone === "danger"
                      ? "bg-danger"
                      : e.tone === "warn"
                        ? "bg-warn"
                        : e.tone === "ok"
                          ? "bg-ok"
                          : "bg-brown",
                  )}
                />
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">
                  {e.text}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          tone="ink"
          className="flex w-full shrink-0 flex-col gap-2.25 p-4 xl:w-[330px]"
        >
          <CardLabel className="text-[#ad9068]">よく使う操作</CardLabel>
          {QUICK_ACTIONS.map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-2.5 rounded-[10px] bg-admin-nav-active px-3 py-2.5 transition-opacity hover:opacity-85"
            >
              <Icon size={15} className="shrink-0 text-line" />
              <span className="flex-1 text-xs font-semibold text-paper">
                {label}
              </span>
              <ChevronRight size={13} className="shrink-0 text-[#ad9068]" />
            </Link>
          ))}
        </Card>
      </div>
    </>
  );
}
