import type { ReactNode } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileTabBar } from "./MobileTabBar";
import { MobileDrawer } from "./MobileDrawer";

/**
 * アプリ全体のシェル。
 * サイドナビ(>=768) / トップバー / コンテンツ / 下部タブバー(<768) の4点構成。
 * 高さは .pen のアートボード 900px ではなく dvh 基準にする。
 *
 * パンくず・タイトルは Redux の ui slice が持つので、ここでは受け渡さない。
 */
export function AppShell({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-paper">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4 md:p-7">
          {children ?? <Outlet />}
        </main>
        <MobileTabBar />
      </div>
      <MobileDrawer />
    </div>
  );
}
