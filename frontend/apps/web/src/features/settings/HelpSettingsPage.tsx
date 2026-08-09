import { useState } from "react";
import { Bug, ChevronDown, ChevronRight } from "lucide-react";
import { Button, cn } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useHelpSettings } from "@/lib/api/settings";
import { SettingsGroup, SettingsLayout, SettingsRow } from "./SettingsLayout";

export function HelpSettingsPage() {
  usePageMeta("その他", "設定 — ヘルプ");
  const help = useHelpSettings();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <SettingsLayout subtitle="ヘルプ · 使い方と問い合わせ">
      <SettingsGroup title="よくある質問">
        {help.faqs.map((f) => {
          const open = openFaq === f.question;
          return (
            <div key={f.question} className="flex flex-col gap-2">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenFaq(open ? null : f.question)}
                className="flex items-center gap-3 text-left"
              >
                <span className="min-w-0 flex-1 text-[13px] font-medium text-ink">
                  {f.question}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-muted transition-transform",
                    open && "rotate-180",
                  )}
                />
              </button>
              {open && (
                <p className="text-[11px] leading-relaxed text-brown">
                  {f.answer}
                </p>
              )}
            </div>
          );
        })}
      </SettingsGroup>

      <SettingsGroup title="問い合わせ">
        <SettingsRow
          label="フォームから問い合わせる"
          description={`${help.responseTime}に、登録メールアドレスへ返信します`}
          control={
            <Button variant="outline" size="sm">
              フォームを開く
            </Button>
          }
        />
        <SettingsRow
          label="不具合を報告する"
          control={
            <span className="flex items-center gap-2">
              <Bug size={15} className="text-brown" />
              <ChevronRight size={16} className="text-muted" />
            </span>
          }
        />
      </SettingsGroup>

      <SettingsGroup title="ドキュメント">
        {help.links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="flex items-center gap-3 text-[13px] font-medium text-ink"
          >
            <span className="min-w-0 flex-1">{l.label}</span>
            <ChevronRight size={16} className="shrink-0 text-muted" />
          </a>
        ))}
      </SettingsGroup>

      <SettingsGroup title="アプリ情報">
        {[
          { k: "バージョン", v: help.version },
          { k: "最終更新", v: help.updatedAt },
          { k: "サポート ID", v: help.supportId },
        ].map((row) => (
          <div key={row.k} className="flex items-center gap-3">
            <span className="min-w-0 flex-1 text-xs font-medium text-brown">
              {row.k}
            </span>
            <span className="text-xs font-semibold text-ink">{row.v}</span>
          </div>
        ))}
      </SettingsGroup>
    </SettingsLayout>
  );
}
