import { useNavigate } from "react-router";
import { Badge, Button, Card, CardLabel, cn } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useInvoicesQuery, useUsageQuery } from "@/lib/api/settings";
import { SettingsLayout, SettingsPaneSkeleton } from "./SettingsLayout";

export function SubscriptionPage() {
  usePageMeta("その他", "設定 — サブスクリプション");
  const navigate = useNavigate();
  const { data: usage, isLoading: usageLoading } = useUsageQuery();
  const { data: invoices, isLoading: invoicesLoading } = useInvoicesQuery();

  if (usageLoading || invoicesLoading || !usage || !invoices) {
    return (
      <SettingsPaneSkeleton subtitle="サブスクリプション · プランと請求" />
    );
  }

  return (
    <SettingsLayout subtitle="サブスクリプション · プランと請求">
      <Card
        tone="surface"
        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <CardLabel>現在のプラン</CardLabel>
          <span className="flex items-center gap-2.5">
            <span className="text-[22px] leading-none font-bold text-ink">
              Free
            </span>
            <Badge className="bg-paper">172日 利用中</Badge>
          </span>
          <span className="text-xs text-brown">
            Web版・モバイル版どちらも同じプランが適用されます。
          </span>
        </div>
        <Button onClick={() => navigate("/premium")}>Premium にする</Button>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {usage.map((u) => (
          <Card key={u.label} className="flex flex-col gap-2 p-4">
            <span className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ink">{u.label}</span>
              <span className="h-px flex-1" />
              <span className="text-xs font-bold text-brown">{u.value}</span>
            </span>
            <span className="h-1.75 w-full overflow-hidden rounded-full bg-track">
              <span
                className={cn(
                  "block h-full rounded-full",
                  u.ratio >= 0.6 ? "bg-ink" : "bg-brown",
                )}
                style={{ width: `${Math.max(4, u.ratio * 100)}%` }}
              />
            </span>
            <span className="text-[10px] text-muted">{u.note}</span>
          </Card>
        ))}
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-line bg-surface px-4.5 py-3.5">
          <span className="text-xs font-bold text-ink">請求履歴</span>
          <span className="h-px flex-1" />
          <button
            type="button"
            className="text-[11px] font-semibold text-brown hover:text-ink"
          >
            すべての領収書をダウンロード
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line">
              {["日付", "内容", "金額", "状態"].map((h) => (
                <th
                  key={h}
                  className="px-4.5 py-2.5 text-[11px] font-bold tracking-[1px] text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.date} className="border-b border-line last:border-0">
                <td className="px-4.5 py-3.5 text-xs font-medium text-ink">
                  {inv.date}
                </td>
                <td className="px-4.5 py-3.5 text-xs font-medium text-ink">
                  {inv.description}
                </td>
                <td className="px-4.5 py-3.5 text-xs font-medium text-ink">
                  {inv.amount}
                </td>
                <td className="px-4.5 py-3.5">
                  <Badge tone={inv.status === "返金" ? "track" : "solid"}>
                    {inv.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </SettingsLayout>
  );
}
