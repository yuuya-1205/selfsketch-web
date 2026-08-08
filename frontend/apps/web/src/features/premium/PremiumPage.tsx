import { useState } from "react";
import { Check, CreditCard, RefreshCw, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, Segmented, cn } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { PREMIUM_PLANS } from "@/lib/api/settings";

const CYCLES = ["月額", "年額 (2か月分お得)"] as const;

const NOTES = [
  { icon: ShieldCheck, label: "いつでも解約できます" },
  { icon: RefreshCw, label: "Web・モバイルで同じアカウント" },
  { icon: CreditCard, label: "カード / Apple Pay / Google Pay" },
];

export function PremiumPage() {
  usePageMeta("その他", "Premium");
  const [cycle, setCycle] = useState<(typeof CYCLES)[number]>(CYCLES[1]);

  return (
    <div className="flex flex-1 flex-col items-center gap-6">
      <header className="flex flex-col items-center gap-2.5 text-center">
        <span className="text-[11px] font-bold tracking-[2.4px] text-muted">
          SELFSKETCH PREMIUM
        </span>
        <h2 className="text-[34px] leading-tight font-bold text-ink">
          続ける力に、道具を。
        </h2>
        <p className="max-w-160 text-sm leading-[1.8] text-brown">
          未来の自分を何度でも描き直せて、記録は無制限に残せる。Web版・モバイル版のどちらでも同じ機能が使えます。
        </p>
        <Segmented options={CYCLES} value={cycle} onChange={setCycle} />
      </header>

      <div className="flex w-full max-w-210 flex-col items-stretch gap-4.5 lg:flex-row">
        {PREMIUM_PLANS.map((plan) => (
          <Card
            key={plan.name}
            tone={plan.primary ? "ink" : "paper"}
            className="flex flex-1 flex-col gap-3.5 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-base font-bold",
                  plan.primary ? "text-paper" : "text-ink",
                )}
              >
                {plan.name}
              </span>
              <span className="h-px flex-1" />
              {plan.badge && (
                <Badge className="border-0 bg-nav-active text-line">
                  {plan.badge}
                </Badge>
              )}
            </div>

            <div className="flex items-end gap-1.5">
              <span
                className={cn(
                  "text-[34px] leading-none font-bold",
                  plan.primary ? "text-paper" : "text-ink",
                )}
              >
                {plan.price}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  plan.primary ? "text-nav-fg" : "text-brown",
                )}
              >
                {plan.per}
              </span>
            </div>

            <p
              className={cn(
                "text-xs leading-[1.8]",
                plan.primary ? "text-nav-fg" : "text-brown",
              )}
            >
              {plan.description}
            </p>

            <Button
              block
              size="lg"
              variant={plan.primary ? "inverse" : "outline"}
              disabled={!plan.primary}
            >
              {plan.cta}
            </Button>

            <ul className="flex flex-col gap-2.5 pt-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check
                    size={14}
                    className={cn(
                      "shrink-0",
                      plan.primary ? "text-line" : "text-brown",
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      plan.primary ? "text-paper" : "text-ink",
                    )}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {NOTES.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-2 rounded-[10px] bg-surface px-3.5 py-2.5"
          >
            <Icon size={14} className="text-brown" />
            <span className="text-xs font-semibold text-brown">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
