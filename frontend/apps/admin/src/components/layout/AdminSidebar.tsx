import { NavLink } from "react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@selfsketch/ui";
import { ADMIN_NAV_GROUPS } from "@/lib/nav";

/**
 * 管理コンソールのサイドナビ。
 * ユーザー向けWeb版より濃い茶 + ADMIN バッジで、誤操作防止のため見た目を明確に分ける。
 */
export function AdminSidebar() {
  return (
    <nav
      aria-label="管理ナビゲーション"
      className="hidden w-60 shrink-0 flex-col gap-5 bg-admin-nav px-3.5 pt-[22px] pb-[18px] lg:flex"
    >
      <div className="flex items-center gap-2 px-1">
        <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-paper text-[13px] leading-none font-bold text-admin-nav">
          ◆
        </span>
        <span className="text-[15px] font-bold text-paper">SelfSketch</span>
        <span className="rounded-[5px] bg-danger px-1.5 py-0.5 text-[9px] font-bold tracking-[1px] text-paper">
          ADMIN
        </span>
      </div>

      {ADMIN_NAV_GROUPS.map((g) => (
        <div key={g.label} className="flex w-full flex-col gap-0.5">
          <span className="text-[10px] font-bold tracking-[1.5px] text-[#856a4a]">
            {g.label}
          </span>
          <span className="h-1.5" />
          {g.items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-[9px] transition-colors",
                  isActive
                    ? "bg-admin-nav-active"
                    : "hover:bg-admin-nav-active/60",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={isActive ? "text-paper" : "text-[#ad9068]"}
                  />
                  <span
                    className={cn(
                      "text-[13px]",
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

      <div className="flex w-full items-center gap-2 rounded-[9px] bg-nav px-2.5 py-[9px]">
        <span className="size-2 shrink-0 rounded-full bg-ok" />
        <span className="text-[10px] font-semibold text-nav-fg">
          Production · 全システム正常
        </span>
      </div>

      <button
        type="button"
        className="flex w-full items-center gap-2.5 rounded-[11px] bg-nav p-2.5 text-left"
      >
        <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-line text-xs font-bold text-admin-nav">
          T
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-semibold text-paper">
            tanaka@selfsketch.jp
          </span>
          <span className="block text-[10px] text-[#ad9068]">Owner</span>
        </span>
        <ChevronRight size={14} className="shrink-0 text-[#ad9068]" />
      </button>
    </nav>
  );
}
