import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, type AppStore } from "@/lib/store";
import { selectPageMeta } from "@/lib/store/uiSlice";
import { usePageMeta } from "./usePageMeta";

function Page({ crumb, title }: { crumb: string; title: string }) {
  usePageMeta(crumb, title);
  return null;
}

describe("usePageMeta", () => {
  let store: AppStore;

  // ストアはテストごとに作り直す（前のテストの状態を持ち越さない）
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  beforeEach(() => {
    store = createStore();
    document.title = "";
  });

  it("パンくずとタイトルをストアへ入れる", () => {
    render(<Page crumb="メイン" title="今日の自分" />, { wrapper });
    expect(selectPageMeta(store.getState())).toEqual({
      crumb: "メイン",
      title: "今日の自分",
    });
  });

  it("document.title にサフィックスを付ける", () => {
    render(<Page crumb="メイン" title="今日の自分" />, { wrapper });
    expect(document.title).toBe("今日の自分 · SelfSketch");
  });

  it("タイトルが空なら SelfSketch だけにする", () => {
    render(<Page crumb="" title="" />, { wrapper });
    expect(document.title).toBe("SelfSketch");
  });

  it("props が変わったときだけ再実行する", () => {
    const { rerender } = render(<Page crumb="メイン" title="今日の自分" />, {
      wrapper,
    });
    const first = selectPageMeta(store.getState());

    rerender(<Page crumb="メイン" title="今日の自分" />);
    // 同じ props なら effect が走らないので、同じオブジェクトのままになる
    expect(selectPageMeta(store.getState())).toBe(first);

    rerender(<Page crumb="メイン" title="ジャーナル" />);
    expect(selectPageMeta(store.getState())).toEqual({
      crumb: "メイン",
      title: "ジャーナル",
    });
    expect(document.title).toBe("ジャーナル · SelfSketch");
  });
});
