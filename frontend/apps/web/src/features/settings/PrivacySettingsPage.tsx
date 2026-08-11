import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { SelectDisplay, Switch } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { usePrivacySettings } from "@/usecase/settings";
import type { PrivacySettings } from "@/domain/model/settings";
import { QueryErrorView } from "@/presentation/components/QueryBoundary";
import { VISIBILITY_LABEL } from "@/presentation/constants/settings";
import {
  SettingsGroup,
  SettingsLayout,
  SettingsPaneSkeleton,
  SettingsRow,
} from "./SettingsLayout";

const SUBTITLE = "プライバシー · 公開範囲とデータの扱い";

type ToggleKey =
  | "shareStreak"
  | "shareJournal"
  | "acceptFriendRequests"
  | "discoverable"
  | "aiTraining"
  | "anonymousStats";

export function PrivacySettingsPage() {
  usePageMeta("その他", "設定 — プライバシー");
  const { privacy, isLoading, error, retry } = usePrivacySettings();

  if (error) {
    return (
      <SettingsLayout subtitle={SUBTITLE}>
        <QueryErrorView error={error} onRetry={retry} />
      </SettingsLayout>
    );
  }

  if (isLoading || !privacy) {
    return <SettingsPaneSkeleton subtitle={SUBTITLE} />;
  }

  // トグルの初期値をサーバー値から作るので、データが揃ってから中身をマウントする
  return <PrivacySettingsForm privacy={privacy} />;
}

function PrivacySettingsForm({ privacy }: { privacy: PrivacySettings }) {
  const [flags, setFlags] = useState({
    shareStreak: privacy.shareStreak,
    shareJournal: privacy.shareJournal,
    acceptFriendRequests: privacy.acceptFriendRequests,
    discoverable: privacy.discoverable,
    aiTraining: privacy.aiTraining,
    anonymousStats: privacy.anonymousStats,
  });

  const toggle = (k: ToggleKey) => (v: boolean) =>
    setFlags((f) => ({ ...f, [k]: v }));

  const switchFor = (k: ToggleKey, label: string) => (
    <Switch label={label} checked={flags[k]} onChange={toggle(k)} />
  );

  return (
    <SettingsLayout subtitle={SUBTITLE}>
      <SettingsGroup title="公開範囲">
        <SettingsRow
          label="プロフィール"
          control={
            <SelectDisplay
              value={VISIBILITY_LABEL[privacy.profile]}
              className="h-9.5 w-52"
            />
          }
        />
        <SettingsRow
          label="作品ギャラリー"
          control={
            <SelectDisplay
              value={VISIBILITY_LABEL[privacy.gallery]}
              className="h-9.5 w-52"
            />
          }
        />
        <SettingsRow
          label="軌跡を共有する"
          description="フレンドのタイムラインに連続日数が出ます"
          control={switchFor("shareStreak", "軌跡を共有する")}
        />
        <SettingsRow
          label="ジャーナルを共有する"
          description="公開されるのは日付と気分だけ。本文は常に非公開です"
          control={switchFor("shareJournal", "ジャーナルを共有する")}
        />
      </SettingsGroup>

      <SettingsGroup title="フレンドと検索">
        <SettingsRow
          label="フレンド申請を受け取る"
          control={switchFor("acceptFriendRequests", "フレンド申請を受け取る")}
        />
        <SettingsRow
          label="ユーザー名で検索されるようにする"
          description="見つかるのは表示名とアイコンだけです"
          control={switchFor(
            "discoverable",
            "ユーザー名で検索されるようにする",
          )}
        />
      </SettingsGroup>

      <SettingsGroup title="AI と学習データ">
        <SettingsRow
          label="未来の自分を改善に使う"
          description="匿名化したうえで生成モデルの調整に利用します"
          control={switchFor("aiTraining", "未来の自分を改善に使う")}
        />
        <SettingsRow
          label="匿名の利用統計を送る"
          description="画面遷移とクラッシュのみ。記録本文は送りません"
          control={switchFor("anonymousStats", "匿名の利用統計を送る")}
        />
      </SettingsGroup>

      <SettingsGroup title="ブロックと非表示">
        <SettingsRow
          label="ブロック中のユーザー"
          control={
            <span className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brown">
                {privacy.blockedUsers}人
              </span>
              <ChevronRight size={16} className="text-muted" />
            </span>
          }
        />
        <SettingsRow
          label="非表示にしたキーワード"
          control={
            <span className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brown">
                {privacy.mutedKeywords}件
              </span>
              <ChevronRight size={16} className="text-muted" />
            </span>
          }
        />
      </SettingsGroup>
    </SettingsLayout>
  );
}
