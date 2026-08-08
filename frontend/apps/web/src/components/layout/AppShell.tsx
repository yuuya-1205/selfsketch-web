import { createContext, use, useState, type ReactNode } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileTabBar } from "./MobileTabBar";

interface PageMeta {
  crumb: string;
  title: string;
}

const PageMetaContext = createContext<{
  setMeta: (meta: PageMeta) => void;
} | null>(null);

/**
 * 各ページからトップバーの表示内容を差し込むためのフック。
 * ページ側で `usePageMeta({ crumb: "メイン", title: "今日の自分" })` と呼ぶ。
 */
export function usePageMetaSetter() {
  const ctx = use(PageMetaContext);
  if (!ctx) throw new Error("AppShell の外では使えません");
  return ctx.setMeta;
}

/**
 * アプリ全体のシェル。
 * サイドナビ(>=768) / トップバー / コンテンツ / 下部タブバー(<768) の4点構成。
 * 高さは .pen のアートボード 900px ではなく dvh 基準にする。
 */
export function AppShell({ children }: { children?: ReactNode }) {
  const [meta, setMeta] = useState<PageMeta>({ crumb: "", title: "" });

  return (
    <PageMetaContext value={{ setMeta }}>
      <div className="flex h-dvh w-full overflow-hidden bg-paper">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar crumb={meta.crumb} title={meta.title} />
          <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4 md:p-7">
            {children ?? <Outlet />}
          </main>
          <MobileTabBar />
        </div>
      </div>
    </PageMetaContext>
  );
}
