import { useEffect, type ReactNode } from "react";
import { cn } from "@selfsketch/ui";

export interface AuthLayoutProps {
  /** 1–4 */
  step: number;
  stepLabel: string;
  title: string;
  children: ReactNode;
}

/**
 * 未ログイン時のレイアウト。
 * lg 以上: 520px のブランドパネル + 中央 520px のフォーム
 * lg 未満: ブランドパネルを上部バナーに折り返す
 */
export function AuthLayout({
  step,
  stepLabel,
  title,
  children,
}: AuthLayoutProps) {
  useEffect(() => {
    document.title = `${title} · SelfSketch`;
  }, [title]);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-paper lg:flex-row">
      <aside className="flex shrink-0 flex-col justify-between gap-6 bg-nav p-8 lg:w-[520px] lg:p-14">
        <div className="flex items-center gap-2.5">
          <span className="grid size-[30px] shrink-0 place-items-center rounded-[10px] bg-paper text-sm leading-none font-bold text-ink">
            ◆
          </span>
          <span className="text-lg font-bold text-paper">SelfSketch</span>
        </div>

        <div className="hidden flex-col gap-4.5 lg:flex">
          <p className="text-[34px] leading-[1.45] font-bold text-paper">
            5分の自分が、
            <br />
            10年後をかたちづくる。
          </p>
          <p className="text-sm leading-[1.8] text-nav-fg">
            毎日の小さなスケッチを積み重ねて、なりたい自分に近づいていく。Webでも、スマホでも、同じ記録が続きます。
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1 w-11 rounded-full",
                  i <= step ? "bg-paper" : "bg-nav-active",
                )}
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold tracking-[1.2px] text-nav-label">
            {stepLabel}
          </span>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-10 lg:px-20">
        <div className="flex w-full max-w-[520px] flex-col gap-5.5">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AuthKicker({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-bold tracking-[2px] text-muted">
      {children}
    </span>
  );
}

export function AuthTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-[30px] leading-[1.5] font-bold text-ink">{children}</h1>
  );
}

export function AuthBody({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm leading-[1.9] font-normal text-brown">{children}</p>
  );
}
