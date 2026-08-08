import { Bell, Calendar, ChevronDown, RefreshCw, Search } from "lucide-react";
import { Outlet, useLocation } from "react-router";
import { Avatar, IconButton } from "@selfsketch/ui";
import { AdminSidebar } from "./AdminSidebar";
import { ALL_ADMIN_NAV_ITEMS } from "@/lib/nav";

export function AdminShell() {
  const { pathname } = useLocation();
  const current = ALL_ADMIN_NAV_ITEMS.find((i) => i.to === pathname);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#fbf7ef]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-15 w-full shrink-0 items-center gap-3 border-b border-line bg-paper px-6">
          <div className="flex flex-col gap-px">
            <span className="text-[10px] font-semibold tracking-[1.2px] text-muted">
              {current?.groupLabel ?? ""}
            </span>
            <h1 className="text-[17px] font-bold text-ink">
              {current?.label ?? "管理コンソール"}
            </h1>
          </div>

          <span className="h-px flex-1" />

          <div className="hidden h-[34px] items-center gap-[7px] rounded-[9px] border border-line-strong bg-surface px-3 md:flex">
            <Calendar size={13} className="text-brown" />
            <span className="text-xs font-semibold text-ink">
              2026/04/01 – 04/22
            </span>
            <ChevronDown size={13} className="text-muted" />
          </div>

          <label className="hidden h-[34px] w-60 items-center gap-2 rounded-[9px] border border-line-strong bg-surface px-3 lg:flex">
            <Search size={13} className="shrink-0 text-muted" />
            <input
              type="search"
              placeholder="ユーザーID / メールで検索"
              className="w-full bg-transparent text-[11px] text-ink placeholder:text-muted focus:outline-none"
            />
          </label>

          <IconButton label="再読み込み" size={32}>
            <RefreshCw size={15} className="text-brown" />
          </IconButton>
          <IconButton label="通知" size={32}>
            <Bell size={15} className="text-brown" />
          </IconButton>
          <Avatar initial="T" size={30} />
        </header>

        <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
