import {
  Badge,
  Button,
  Card,
  Progress,
  Select,
  type SelectOption,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useState } from "react";
import { useDataSettings } from "@/usecase/settings";
import {
  storageRatio,
  type ExportFormat,
  type ExportStatus,
  type ExportTarget,
} from "@/domain/model/settings";
import { QueryErrorView } from "@/presentation/components/QueryBoundary";
import {
  EXPORT_FORMAT_LABEL,
  EXPORT_FORMAT_SHORT,
  EXPORT_STATUS_LABEL,
  EXPORT_TARGET_LABEL,
  STORAGE_LABEL,
} from "@/presentation/constants/settings";
import {
  EXPORT_FORMAT_OPTIONS,
  EXPORT_TARGET_OPTIONS,
} from "@/presentation/constants/premium";
import {
  settingsDateLabel,
  storageLabel,
} from "@/presentation/format/settings";
import {
  SettingsGroup,
  SettingsLayout,
  SettingsPaneSkeleton,
  SettingsRow,
} from "./SettingsLayout";

const STATUS_TONE: Record<ExportStatus, "ok" | "warn" | "track"> = {
  ready: "ok",
  preparing: "warn",
  expired: "track",
};

const TARGET_SELECT: SelectOption<ExportTarget>[] = EXPORT_TARGET_OPTIONS.map(
  (v) => ({ value: v, label: EXPORT_TARGET_LABEL[v] }),
);

const FORMAT_SELECT: SelectOption<ExportFormat>[] = EXPORT_FORMAT_OPTIONS.map(
  (v) => ({ value: v, label: EXPORT_FORMAT_LABEL[v] }),
);

export function DataSettingsPage() {
  usePageMeta("その他", "設定 — データと書き出し");
  // 書き出しの条件は送信するまでサーバーに残らない画面固有の状態
  const [target, setTarget] = useState<ExportTarget>("all");
  const [format, setFormat] = useState<ExportFormat>("json");
  const { data, isLoading, error, retry } = useDataSettings();

  if (error) {
    return (
      <SettingsLayout subtitle="データと書き出し · バックアップと削除">
        <QueryErrorView error={error} onRetry={retry} />
      </SettingsLayout>
    );
  }

  if (isLoading || !data) {
    return (
      <SettingsPaneSkeleton subtitle="データと書き出し · バックアップと削除" />
    );
  }

  return (
    <SettingsLayout subtitle="データと書き出し · バックアップと削除">
      <SettingsGroup title="書き出し">
        <SettingsRow
          label="書き出す範囲"
          control={
            <Select
              label="書き出す範囲"
              value={target}
              options={TARGET_SELECT}
              onChange={setTarget}
              className="h-9.5 w-60"
            />
          }
        />
        <SettingsRow
          label="形式"
          control={
            <Select
              label="書き出しの形式"
              value={format}
              options={FORMAT_SELECT}
              onChange={setFormat}
              className="h-9.5 w-60"
            />
          }
        />
        <SettingsRow
          label="書き出しをリクエストする"
          description={
            data.canRequestExport
              ? "準備ができたらメールでお知らせします。月に1回まで。"
              : `今月はリクエスト済みです。次に使えるのは ${data.nextExportAvailableAt ? settingsDateLabel(data.nextExportAvailableAt) : "—"} から。`
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
          <div
            key={h.id}
            className="flex flex-wrap items-center gap-x-3 gap-y-1"
          >
            <span className="w-24 shrink-0 text-xs font-semibold text-brown">
              {settingsDateLabel(h.requestedAt)}
            </span>
            <span className="min-w-40 flex-1 truncate text-[13px] font-medium text-ink">
              {EXPORT_TARGET_LABEL[h.target]} ({EXPORT_FORMAT_SHORT[h.format]})
            </span>
            <Badge tone={STATUS_TONE[h.status]}>
              {EXPORT_STATUS_LABEL[h.status]}
            </Badge>
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
          <div key={s.kind} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <span className="min-w-0 flex-1 text-[13px] font-medium text-ink">
                {STORAGE_LABEL[s.kind]}
              </span>
              <span className="text-xs font-semibold text-brown">
                {storageLabel(s.usedBytes, s.limitBytes)}
              </span>
            </div>
            <Progress
              value={storageRatio(s)}
              height={8}
              label={STORAGE_LABEL[s.kind]}
            />
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
