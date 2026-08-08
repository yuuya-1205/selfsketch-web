import { useState } from "react";
import { Segmented, SelectDisplay, Switch } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import {
  SettingsGroup,
  SettingsLayout,
  SettingsRow,
} from "./SettingsLayout";

const THEMES = ["ライト", "ダーク", "システム"] as const;

export function GeneralSettingsPage() {
  usePageMeta("その他", "設定 — 一般");
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("ライト");
  const [flags, setFlags] = useState({
    shortcuts: true,
    autoCollapse: true,
    browserPush: true,
  });

  const toggle = (k: keyof typeof flags) => (v: boolean) =>
    setFlags((f) => ({ ...f, [k]: v }));

  return (
    <SettingsLayout subtitle="一般 · 表示とWeb版の動作">
      <SettingsGroup title="表示">
        <SettingsRow
          label="テーマ"
          control={
            <Segmented
              size="sm"
              options={THEMES}
              value={theme}
              onChange={setTheme}
            />
          }
        />
        <SettingsRow
          label="文字サイズ"
          control={<SelectDisplay value="標準 (16px)" className="h-9.5 w-52" />}
        />
        <SettingsRow
          label="言語"
          control={<SelectDisplay value="日本語" className="h-9.5 w-52" />}
        />
      </SettingsGroup>

      <SettingsGroup title="記録のルール">
        <SettingsRow
          label="週のはじまり"
          control={<SelectDisplay value="月曜日" className="h-9.5 w-52" />}
        />
        <SettingsRow
          label="タイムゾーン"
          control={
            <SelectDisplay value="(GMT+9) 東京" className="h-9.5 w-52" />
          }
        />
        <SettingsRow
          label="1日の切り替わり"
          control={<SelectDisplay value="午前 4:00" className="h-9.5 w-52" />}
        />
      </SettingsGroup>

      <SettingsGroup title="Web版の動作">
        <SettingsRow
          label="ログイン後に開く画面"
          control={<SelectDisplay value="今日" className="h-9.5 w-52" />}
        />
        <SettingsRow
          label="キーボードショートカットを有効にする"
          description="⌘K で検索、⌘N で新規エントリー"
          control={
            <Switch
              label="キーボードショートカット"
              checked={flags.shortcuts}
              onChange={toggle("shortcuts")}
            />
          }
        />
        <SettingsRow
          label="サイドバーを自動で折りたたむ"
          description="ウィンドウ幅が 1280px 未満のとき"
          control={
            <Switch
              label="サイドバーを自動で折りたたむ"
              checked={flags.autoCollapse}
              onChange={toggle("autoCollapse")}
            />
          }
        />
        <SettingsRow
          label="ブラウザ通知を許可"
          description="リマインドをデスクトップに表示します"
          control={
            <Switch
              label="ブラウザ通知を許可"
              checked={flags.browserPush}
              onChange={toggle("browserPush")}
            />
          }
        />
      </SettingsGroup>
    </SettingsLayout>
  );
}
