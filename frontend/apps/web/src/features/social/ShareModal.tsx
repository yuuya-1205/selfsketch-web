import { useState } from "react";
import { useNavigate } from "react-router";
// lucide v1 でブランドアイコン（Twitter/Instagram）は削除されたため汎用アイコンで代替する
import { AtSign, Camera, Download, Link2, Lock } from "lucide-react";
import {
  Button,
  CardLabel,
  Modal,
  Switch,
  cn,
} from "@selfsketch/ui";
import {
  SHARE_OPTIONS,
  SHARE_TEMPLATES,
} from "@/presentation/constants/social";

const TEMPLATE_SWATCH: Record<string, string> = {
  ダーク: "bg-ink",
  ペーパー: "bg-surface",
  ミニマル: "bg-paper",
};

const TARGETS = [
  { icon: AtSign, label: "X" },
  { icon: Camera, label: "Instagram" },
  { icon: Link2, label: "リンク" },
  { icon: Download, label: "保存" },
];

export function ShareModal() {
  const navigate = useNavigate();
  const close = () => navigate("/friends");
  const [template, setTemplate] = useState<string>(SHARE_TEMPLATES[0]);
  const [options, setOptions] = useState(SHARE_OPTIONS);

  return (
    <Modal
      onClose={close}
      title="シェアカードを作成"
      description="公開する範囲はあなたが決められます"
      width={660}
      footer={
        <>
          <Lock size={14} className="text-muted" />
          <span className="flex-1 text-[11px] font-medium text-muted">
            非公開の記録は共有されません
          </span>
          <Button onClick={close}>シェアする</Button>
        </>
      }
    >
      <div className="flex flex-col gap-5 p-6 md:flex-row">
        {/* プレビュー */}
        <div className="flex h-85 w-full shrink-0 flex-col gap-3.5 rounded-[14px] bg-ink p-5 md:w-[270px]">
          <span className="text-[9px] font-bold tracking-[2.4px] text-nav-icon">
            SELFSKETCH
          </span>
          <div className="flex-1 rounded-[10px] bg-nav-active" />
          <span className="text-[26px] leading-none font-bold text-paper">
            14日連続
          </span>
          <span className="text-[11px] font-medium text-nav-fg">
            5分スケッチ · 2026.04.22
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <CardLabel className="text-[10px]">テンプレート</CardLabel>
            <div className="flex gap-2">
              {SHARE_TEMPLATES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTemplate(t)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1.5 rounded-[11px] border px-1.5 py-2.5 transition-colors",
                    t === template
                      ? "border-[1.5px] border-ink"
                      : "border-line-strong",
                  )}
                >
                  <span
                    className={cn(
                      "h-8 w-full rounded-[7px] border border-line-strong",
                      TEMPLATE_SWATCH[t],
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      t === template ? "text-ink" : "text-brown",
                    )}
                  >
                    {t}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-4">
            <CardLabel className="text-[10px]">含める情報</CardLabel>
            {options.map((o, i) => (
              <div key={o.label} className="flex items-center gap-2.5">
                <span className="flex-1 text-xs font-medium text-ink">
                  {o.label}
                </span>
                <Switch
                  label={o.label}
                  checked={o.enabled}
                  onChange={(v) =>
                    setOptions((prev) =>
                      prev.map((p, pi) =>
                        pi === i ? { ...p, enabled: v } : p,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <CardLabel className="text-[10px]">共有先</CardLabel>
            <div className="flex gap-2">
              {TARGETS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex h-14 flex-1 flex-col items-center justify-center gap-1.5 rounded-[11px] border border-line-strong transition-colors hover:bg-surface"
                >
                  <Icon size={16} className="text-brown" />
                  <span className="text-[10px] font-semibold text-brown">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
