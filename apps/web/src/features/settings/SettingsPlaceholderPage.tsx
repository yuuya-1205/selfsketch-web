import { Card } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { SettingsLayout } from "./SettingsLayout";

/** プライバシー / データ / ヘルプ など、まだ実装していない設定タブ */
export function SettingsPlaceholderPage({ title }: { title: string }) {
  usePageMeta("その他", `設定 — ${title}`);

  return (
    <SettingsLayout subtitle={title}>
      <Card
        tone="surface"
        className="grid flex-1 place-items-center border-dashed p-10 text-center"
      >
        <div className="flex max-w-md flex-col gap-2">
          <p className="text-base font-bold text-ink">{title}</p>
          <p className="text-xs leading-relaxed text-brown">
            この設定タブはデザイン未確定です。selfsketch.pen の「9-10.
            通知 / 設定」に追加してから実装します。
          </p>
        </div>
      </Card>
    </SettingsLayout>
  );
}
