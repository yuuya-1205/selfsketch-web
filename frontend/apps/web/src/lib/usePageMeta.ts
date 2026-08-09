import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { pageMetaSet } from "@/lib/store/uiSlice";

/** ページのパンくず・タイトルをトップバーへ反映する */
export function usePageMeta(crumb: string, title: string) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(pageMetaSet({ crumb, title }));
    document.title = title ? `${title} · SelfSketch` : "SelfSketch";
  }, [crumb, title, dispatch]);
}
