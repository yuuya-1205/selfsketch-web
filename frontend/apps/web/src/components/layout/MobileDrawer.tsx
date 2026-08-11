import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@selfsketch/ui";
import { NAV_GROUPS } from "@/lib/nav";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { drawerClosed, selectDrawerOpen } from "@/lib/store/uiSlice";
import { useAuth } from "@/usecase/auth";

/**
 * モバイル(<768)のナビゲーションドロワー（.pen の Mobile Web 390 - ドロワー）。
 *
 * 下部タブバーには 5 つしか置けないので、設定・通知・インサイトなどへは
 * ここからしか行けない。トップバーのハンバーガーが開く。
 */
export function MobileDrawer() {
  const open = useAppSelector(selectDrawerOpen);
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { pathname } = useLocation();

  // 行き先へ移ったら閉じる。開いたままだと遷移先が隠れる
  useEffect(() => {
    dispatch(drawerClosed());
  }, [pathname, dispatch]);

  // Esc で閉じる。開いているあいだは背後をスクロールさせない
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(drawerClosed());
    };
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, dispatch]);

  if (!open) return null;

  const close = () => dispatch(drawerClosed());

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <nav
        aria-label="メインナビゲーション"
        className="flex w-[296px] max-w-[85vw] shrink-0 flex-col gap-5 overflow-y-auto bg-nav px-4 py-5"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-paper text-[13px] leading-none font-bold text-ink">
            ◆
          </span>
          <span className="flex-1 text-[17px] font-bold tracking-[0.2px] text-paper">
            SelfSketch
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="メニューを閉じる"
            className="grid size-8 place-items-center rounded-[10px] text-nav-icon transition-colors hover:bg-nav-active"
          >
            <X size={18} />
          </button>
        </div>

        {NAV_GROUPS.map((groupItem) => (
          <div key={groupItem.label} className="flex flex-col gap-1">
            <span className="mb-1.5 text-[10px] font-bold tracking-[1.5px] text-nav-label">
              {groupItem.label}
            </span>
            {groupItem.items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-[10px] px-2.5 py-[9px] transition-colors",
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

        <Link
          to="/settings/account"
          className="flex items-center gap-2.5 rounded-xl bg-nav-card p-2.5"
        >
          <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-line text-xs font-bold text-ink">
            {user?.displayName.slice(0, 1) ?? ""}
          </span>
          <span className="flex-1">
            <span className="block text-xs font-semibold text-paper">
              {user?.displayName ?? ""}
            </span>
            <span className="block text-[10px] text-nav-icon">Free プラン</span>
          </span>
          <ChevronRight size={14} className="text-nav-icon" />
        </Link>
      </nav>

      <button
        type="button"
        onClick={close}
        aria-label="メニューを閉じる"
        className="flex-1 bg-ink/40"
      />
    </div>
  );
}
