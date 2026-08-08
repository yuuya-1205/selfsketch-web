import { ChevronRight } from "lucide-react";
import { Button, Card, Field, Input } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import {
  SettingsGroup,
  SettingsLayout,
  SettingsRow,
} from "./SettingsLayout";

const LINKED = [
  { name: "Google", status: "yuki@gmail.com で連携中", connected: true },
  { name: "Apple", status: "未連携", connected: false },
];

const SECURITY = [
  { label: "パスワードを変更", description: "最終更新: 2026年1月" },
  { label: "すべての記録を書き出す", description: "CSV / JSON · Web版のみ" },
  { label: "ログイン中の端末", description: "3台 (Chrome, iPhone, iPad)" },
];

export function AccountSettingsPage() {
  usePageMeta("その他", "設定 — アカウント");

  return (
    <SettingsLayout subtitle="アカウント · プロフィールと連携">
      <SettingsGroup title="プロフィール">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-line text-xl font-bold text-ink">
            ゆ
          </span>
          <span className="flex flex-1 flex-col gap-1">
            <span className="text-base font-bold text-ink">ゆうき</span>
            <span className="text-[11px] text-muted">
              yuki@example.com · 2025年11月から利用中
            </span>
          </span>
          <Button variant="outline" size="sm">
            画像を変更
          </Button>
        </div>

        <Field label="表示名">
          <Input defaultValue="ゆうき" className="h-10" />
        </Field>
        <Field label="メールアドレス">
          <Input
            defaultValue="yuki@example.com"
            type="email"
            className="h-10"
          />
        </Field>
      </SettingsGroup>

      <SettingsGroup title="連携アカウント">
        {LINKED.map((l) => (
          <div
            key={l.name}
            className="flex items-center gap-3 rounded-[11px] bg-surface p-3"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line-strong bg-paper text-[13px] font-bold text-ink">
              {l.name[0]}
            </span>
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-ink">
                {l.name}
              </span>
              <span className="text-[11px] text-muted">{l.status}</span>
            </span>
            <Button variant="outline" size="sm">
              {l.connected ? "解除" : "連携する"}
            </Button>
          </div>
        ))}
      </SettingsGroup>

      <SettingsGroup title="セキュリティとデータ">
        {SECURITY.map((s) => (
          <SettingsRow
            key={s.label}
            label={s.label}
            description={s.description}
            control={<ChevronRight size={16} className="text-muted" />}
          />
        ))}
      </SettingsGroup>

      <Card className="flex items-center gap-3 border-danger p-3.5">
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-[13px] font-bold text-danger">
            アカウントを削除
          </span>
          <span className="text-[11px] text-muted">
            すべての記録・作品・未来の自分が削除されます。取り消せません。
          </span>
        </span>
        <Button variant="danger" size="sm">
          削除に進む
        </Button>
      </Card>
    </SettingsLayout>
  );
}
