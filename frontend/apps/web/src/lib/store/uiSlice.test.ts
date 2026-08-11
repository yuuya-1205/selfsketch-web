import { describe, expect, it } from "vitest";
import { createStore } from "./index";
import {
  drawerClosed,
  drawerOpened,
  pageMetaSet,
  selectDrawerOpen,
  selectPageMeta,
} from "./uiSlice";

describe("uiSlice", () => {
  it("初期状態では空のページメタを返す", () => {
    const store = createStore();
    expect(selectPageMeta(store.getState())).toEqual({ crumb: "", title: "" });
  });

  it("pageMetaSet でパンくずとタイトルを差し替える", () => {
    const store = createStore();
    store.dispatch(pageMetaSet({ crumb: "その他", title: "設定 — 一般" }));
    expect(selectPageMeta(store.getState())).toEqual({
      crumb: "その他",
      title: "設定 — 一般",
    });
  });

  it("ドロワーは初期状態で閉じている", () => {
    const store = createStore();
    expect(selectDrawerOpen(store.getState())).toBe(false);
  });

  it("ドロワーを開いて閉じられる", () => {
    const store = createStore();
    store.dispatch(drawerOpened());
    expect(selectDrawerOpen(store.getState())).toBe(true);
    store.dispatch(drawerClosed());
    expect(selectDrawerOpen(store.getState())).toBe(false);
  });

  it("閉じているところに drawerClosed を投げても壊れない", () => {
    const store = createStore();
    store.dispatch(drawerClosed());
    expect(selectDrawerOpen(store.getState())).toBe(false);
  });

  it("createStore はストアごとに独立している", () => {
    const a = createStore();
    const b = createStore();
    a.dispatch(pageMetaSet({ crumb: "メイン", title: "今日の自分" }));
    expect(selectPageMeta(b.getState())).toEqual({ crumb: "", title: "" });
  });
});
