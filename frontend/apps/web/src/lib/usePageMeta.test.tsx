import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { usePageMeta } from "./usePageMeta";

const setMeta = vi.fn();

// AppShell の Context に依存せずフック単体を検証する
vi.mock("@/components/layout/pageMetaContext", () => ({
  usePageMetaSetter: () => setMeta,
}));

function Page({ crumb, title }: { crumb: string; title: string }) {
  usePageMeta(crumb, title);
  return null;
}

describe("usePageMeta", () => {
  beforeEach(() => {
    setMeta.mockClear();
    document.title = "";
  });

  it("パンくずとタイトルをトップバーへ渡す", () => {
    render(<Page crumb="メイン" title="今日の自分" />);
    expect(setMeta).toHaveBeenCalledWith({
      crumb: "メイン",
      title: "今日の自分",
    });
  });

  it("document.title にサフィックスを付ける", () => {
    render(<Page crumb="メイン" title="今日の自分" />);
    expect(document.title).toBe("今日の自分 · SelfSketch");
  });

  it("タイトルが空なら SelfSketch だけにする", () => {
    render(<Page crumb="" title="" />);
    expect(document.title).toBe("SelfSketch");
  });

  it("props が変わったときだけ再実行する", () => {
    const { rerender } = render(<Page crumb="メイン" title="今日の自分" />);
    expect(setMeta).toHaveBeenCalledTimes(1);

    rerender(<Page crumb="メイン" title="今日の自分" />);
    expect(setMeta).toHaveBeenCalledTimes(1);

    rerender(<Page crumb="メイン" title="ジャーナル" />);
    expect(setMeta).toHaveBeenCalledTimes(2);
    expect(document.title).toBe("ジャーナル · SelfSketch");
  });
});
