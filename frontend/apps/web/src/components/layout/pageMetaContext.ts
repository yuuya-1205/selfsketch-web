import { createContext, use } from "react";

export interface PageMeta {
  crumb: string;
  title: string;
}

export const PageMetaContext = createContext<{
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
