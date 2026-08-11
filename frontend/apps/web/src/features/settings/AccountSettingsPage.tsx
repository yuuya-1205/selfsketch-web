import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import { Button, Card, Field, Input } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useAuth, useLogout } from "@/usecase/auth";
import { SettingsGroup, SettingsLayout, SettingsRow } from "./SettingsLayout";

const LINKED = [
  { name: "Google", status: "yuki@gmail.com で連携中", connected: true },
  { name: "Apple", status: "未連携", connected: false },
];

const SECURITY = [
  { label: "パスワードを変更", description: "最終更新: 2026年1月" },
  { label: "すべての記録を書き出す", description: "CSV / JSON · Web版のみ" },
  { label: "ログイン中の端末", description: "3台 (Chrome, iPhone, iPad)" },
];

const SINCE = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
});

export function AccountSettingsPage() {
  usePageMeta("その他", "設定 — アカウント");

  const navigate = useNavigate();
  const { user } = useAuth();
  const logout = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <SettingsLayout subtitle="アカウント · プロフィールと連携">
      <SettingsGroup title="プロフィール">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-line text-xl font-bold text-ink">
            {user?.displayName.slice(0, 1) ?? ""}
          </span>
          <span className="flex flex-1 flex-col gap-1">
            <span className="text-base font-bold text-ink">
              {user?.displayName ?? ""}
            </span>
            <span className="text-[11px] text-muted">
              {user
                ? `${user.email} · ${SINCE.format(user.createdAt)}から利用中`
                : ""}
            </span>
          </span>
          <Button variant="outline" size="sm">
            画像を変更
          </Button>
        </div>

        {/* key を付けてセッション取得後の値で作り直す（非制御のため） */}
        <Field label="表示名">
          <Input
            key={`name-${user?.id}`}
            defaultValue={user?.displayName ?? ""}
            className="h-10"
          />
        </Field>
        <Field label="メールアドレス">
          <Input
            key={`email-${user?.id}`}
            defaultValue={user?.email ?? ""}
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

      <SettingsGroup title="このデバイス">
        <SettingsRow
          label="ログアウト"
          description="記録は消えません。次回また同じアカウントで入れます"
          control={
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "処理中…" : "ログアウト"}
            </Button>
          }
        />
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
