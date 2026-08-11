import { Link, NavLink } from "react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@selfsketch/ui";
import { NAV_GROUPS } from "@/lib/nav";
import { useAuth } from "@/usecase/auth";

/**
 * デスクトップ用サイドナビ。
 *  - xl (>=1280) : 240px フル表示
 *  - md–xl       : 76px アイコンレール
 *  - <md         : 非表示（下部タブバーに切り替わる）
 */
export function Sidebar() {
  const { user } = useAuth();

  return (
    <nav
      aria-label="メインナビゲーション"
      className={cn(
        "hidden shrink-0 flex-col gap-[22px] bg-nav md:flex",
        "w-[76px] items-center px-3 pt-6 pb-5",
        "xl:w-60 xl:items-stretch xl:px-4",
      )}
    >
      <div className="flex items-center gap-2.5 xl:px-1">
        <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-paper text-[13px] leading-none font-bold text-ink">
          ◆
        </span>
        <span className="hidden text-[17px] font-bold tracking-[0.2px] text-paper xl:block">
          SelfSketch
        </span>
      </div>

      {NAV_GROUPS.map((groupItem) => (
        <div
          key={groupItem.label}
          className="flex w-full flex-col items-center gap-1 xl:items-stretch"
        >
          <span className="hidden text-[10px] font-bold tracking-[1.5px] text-nav-label xl:block">
            {groupItem.label}
          </span>
          <span className="hidden h-1.5 xl:block" />
          {groupItem.items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-[10px] transition-colors",
                  "size-11 justify-center xl:size-auto xl:w-full xl:justify-start xl:px-2.5 xl:py-[9px]",
                  isActive ? "bg-nav-active" : "hover:bg-nav-active/60",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={isActive ? "text-paper" : "text-nav-icon"}
                  />
                  <span
                    className={cn(
                      "hidden text-[13px] xl:block",
                      isActive
                        ? "font-semibold text-paper"
                        : "font-medium text-nav-fg",
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="flex-1" />

      <Link
        to="/settings/account"
        aria-label="アカウント設定"
        className="flex w-full items-center justify-center gap-2.5 rounded-xl p-2.5 text-left transition-colors hover:bg-nav-card xl:justify-start xl:bg-nav-card"
      >
        <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-line text-xs font-bold text-ink">
          {user?.displayName.slice(0, 1) ?? ""}
        </span>
        <span className="hidden flex-1 xl:block">
          <span className="block text-xs font-semibold text-paper">
            {user?.displayName ?? ""}
          </span>
          <span className="block text-[10px] text-nav-icon">Free プラン</span>
        </span>
        <ChevronRight size={14} className="hidden text-nav-icon xl:block" />
      </Link>
    </nav>
  );
}
