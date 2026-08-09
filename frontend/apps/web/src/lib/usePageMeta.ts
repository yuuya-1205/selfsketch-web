import { useEffect } from "react";
import { usePageMetaSetter } from "@/components/layout/pageMetaContext";

/** ページのパンくず・タイトルをトップバーへ反映する */
export function usePageMeta(crumb: string, title: string) {
  const setMeta = usePageMetaSetter();
  useEffect(() => {
    setMeta({ crumb, title });
    document.title = title ? `${title} · SelfSketch` : "SelfSketch";
  }, [crumb, title, setMeta]);
}
