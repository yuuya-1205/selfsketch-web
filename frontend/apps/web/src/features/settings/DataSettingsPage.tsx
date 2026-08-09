import { Badge, Button, Card, Progress, SelectDisplay } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import {
  EXPORT_FORMATS,
  EXPORT_TARGETS,
  useDataSettings,
} from "@/lib/api/settings";
import type { ExportStatus } from "@/lib/api/types";
import { SettingsGroup, SettingsLayout, SettingsRow } from "./SettingsLayout";

const STATUS_TONE: Record<ExportStatus, "ok" | "warn" | "track"> = {
  準備完了: "ok",
  作成中: "warn",
  期限切れ: "track",
};

export function DataSettingsPage() {
  usePageMeta("その他", "設定 — データと書き出し");
  const data = useDataSettings();

  return (
    <SettingsLayout subtitle="データと書き出し · バックアップと削除">
      <SettingsGroup title="書き出し">
        <SettingsRow
          label="書き出す範囲"
          control={
            <SelectDisplay value={EXPORT_TARGETS[0]} className="h-9.5 w-60" />
          }
        />
        <SettingsRow
          label="形式"
          control={
            <SelectDisplay value={EXPORT_FORMATS[0]} className="h-9.5 w-60" />
          }
        />
        <SettingsRow
          label="書き出しをリクエストする"
          description={
            data.canRequestExport
              ? "準備ができたらメールでお知らせします。月に1回まで。"
              : `今月はリクエスト済みです。次に使えるのは ${data.nextExportAvailableAt} から。`
          }
          control={
            <Button size="sm" disabled={!data.canRequestExport}>
              リクエスト
            </Button>
          }
        />
      </SettingsGroup>

      <SettingsGroup title="書き出しの履歴">
        {data.history.map((h) => (
          <div key={h.date} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-brown">
              {h.date}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
              {h.target}
            </span>
            <Badge tone={STATUS_TONE[h.status]}>{h.status}</Badge>
            {h.downloadUrl ? (
              <a
                href={h.downloadUrl}
                className="shrink-0 text-xs font-bold text-ink underline-offset-2 hover:underline"
              >
                ダウンロード
              </a>
            ) : (
              <span className="shrink-0 text-xs font-bold text-muted">—</span>
            )}
          </div>
        ))}
      </SettingsGroup>

      <SettingsGroup title="保存容量">
        {data.storage.map((s) => (
          <div key={s.label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <span className="min-w-0 flex-1 text-[13px] font-medium text-ink">
                {s.label}
              </span>
              <span className="text-xs font-semibold text-brown">{s.used}</span>
            </div>
            <Progress value={s.ratio} height={8} label={s.label} />
          </div>
        ))}
      </SettingsGroup>

      <Card className="flex items-center gap-3 border-danger p-3.5">
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-[13px] font-bold text-danger">
            すべての記録を削除する
          </span>
          <span className="text-[11px] text-muted">
            習慣・ジャーナル・作品・未来の自分がすべて消えます。取り消せません。
          </span>
        </span>
        <Button variant="danger" size="sm">
          削除に進む
        </Button>
      </Card>
    </SettingsLayout>
  );
}
