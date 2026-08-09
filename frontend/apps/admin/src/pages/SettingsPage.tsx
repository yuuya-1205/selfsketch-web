import { useState } from "react";
import {
  Button,
  Card,
  PageHeader,
  SelectDisplay,
  Switch,
} from "@selfsketch/ui";
import { Pill } from "@/components/Table";
import {
  FEATURE_FLAGS,
  INTEGRATIONS,
  OPERATION_THRESHOLDS,
  RETENTION_SETTINGS,
  SERVICE_SETTINGS,
} from "@/lib/api/mock";

/** カード見出し + 本文。Adm 9 の各ブロック */
function Panel({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: "danger";
}) {
  return (
    <Card
      className={
        tone === "danger"
          ? "flex flex-col overflow-hidden border-danger p-0"
          : "flex flex-col overflow-hidden p-0"
      }
    >
      <div className="border-b border-line bg-surface px-4 py-2.5">
        <span className="text-xs font-bold text-ink">{title}</span>
      </div>
      <div className="flex flex-col gap-3 p-4">{children}</div>
    </Card>
  );
}

function SettingRow({
  label,
  note,
  control,
}: {
  label: string;
  note?: string | null;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        {note && <span className="text-[11px] text-muted">{note}</span>}
      </span>
      {control}
    </div>
  );
}

export function SettingsPage() {
  const [flags, setFlags] = useState(() =>
    Object.fromEntries(FEATURE_FLAGS.map((f) => [f.key, f.on])),
  );
  const [readOnly, setReadOnly] = useState(false);

  return (
    <>
      <PageHeader
        title="設定"
        description="サービス全体の既定値と運用しきい値。変更は監査ログに残り、反映まで最大5分かかります。"
        actions={
          <>
            <Button variant="outline" size="sm">
              変更履歴
            </Button>
            <Button size="sm">変更を保存</Button>
          </>
        }
      />

      <div className="flex flex-col gap-3.5 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <Panel title="一般">
            {SERVICE_SETTINGS.map((s) => (
              <SettingRow
                key={s.label}
                label={s.label}
                control={
                  <SelectDisplay value={s.value} className="h-8.5 w-60" />
                }
              />
            ))}
          </Panel>

          <Panel title="運用しきい値">
            {OPERATION_THRESHOLDS.map((s) => (
              <SettingRow
                key={s.label}
                label={s.label}
                control={
                  <SelectDisplay value={s.value} className="h-8.5 w-52" />
                }
              />
            ))}
          </Panel>

          <Panel title="機能フラグ">
            {FEATURE_FLAGS.map((f) => (
              <SettingRow
                key={f.key}
                label={f.label}
                note={f.note}
                control={
                  <Switch
                    label={f.label}
                    checked={flags[f.key]}
                    onChange={(v) => setFlags((s) => ({ ...s, [f.key]: v }))}
                  />
                }
              />
            ))}
          </Panel>
        </div>

        <div className="flex shrink-0 flex-col gap-3.5 xl:w-[340px]">
          <Panel title="外部連携">
            {INTEGRATIONS.map((i) => (
              <div key={i.name} className="flex items-center gap-2.5">
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[13px] font-semibold text-ink">
                    {i.name}
                  </span>
                  <span className="text-[11px] text-muted">{i.meta}</span>
                </span>
                <Pill tone={i.tone === "ok" ? "ok" : "warn"}>{i.status}</Pill>
              </div>
            ))}
          </Panel>

          <Panel title="データ保持">
            {RETENTION_SETTINGS.map((r) => (
              <SettingRow
                key={r.label}
                label={r.label}
                control={
                  <SelectDisplay value={r.value} className="h-8.5 w-32" />
                }
              />
            ))}
          </Panel>

          <Panel title="メンテナンスモード" tone="danger">
            <SettingRow
              label="読み取り専用にする"
              note="全ユーザーの書き込みを止めます"
              control={
                <Switch
                  label="読み取り専用にする"
                  checked={readOnly}
                  onChange={setReadOnly}
                />
              }
            />
            <Button variant="danger" size="sm" className="self-start">
              AI 生成を緊急停止
            </Button>
          </Panel>
        </div>
      </div>
    </>
  );
}
