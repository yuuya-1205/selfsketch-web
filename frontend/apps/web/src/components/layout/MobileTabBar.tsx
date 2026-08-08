import { NavLink } from "react-router";
import { cn } from "@selfsketch/ui";
import { MOBILE_TABS } from "@/lib/nav";

/** <768px でのみ表示。アプリの下部タブバーと同じ構成に揃える */
export function MobileTabBar() {
  return (
    <nav
      aria-label="タブバー"
      className="flex h-[66px] w-full shrink-0 items-center bg-nav px-2 md:hidden"
    >
      {MOBILE_TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5"
        >
          {({ isActive }) => (
            <>
              <Icon
                size={18}
                className={isActive ? "text-paper" : "text-muted"}
              />
              <span
                className={cn(
                  "w-full truncate text-center text-[10px]",
                  isActive ? "font-semibold text-paper" : "text-muted",
                )}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
