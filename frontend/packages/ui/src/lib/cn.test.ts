import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("後勝ちで衝突する Tailwind ユーティリティをマージする", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-brown", "text-muted")).toBe("text-muted");
  });

  it("衝突しないクラスは順序を保って残す", () => {
    expect(cn("flex", "items-center", "gap-2")).toBe("flex items-center gap-2");
  });

  it("falsy な値を無視する", () => {
    expect(cn("flex", false, null, undefined, "", "gap-2")).toBe("flex gap-2");
  });

  it("配列・オブジェクト記法の条件付きクラスを解決する", () => {
    expect(cn(["flex", ["gap-2"]], { "w-full": true, hidden: false })).toBe(
      "flex gap-2 w-full",
    );
  });

  it("任意値クラス同士の衝突も解決する", () => {
    expect(cn("rounded-[9px]", "rounded-[12px]")).toBe("rounded-[12px]");
  });

  it("theme.css 独自トークンは tailwind-merge の既定設定では衝突扱いにならない", () => {
    // rounded-control は @theme のカスタムトークンで twMerge が既定では知らない。
    // 打ち消したいときは後ろに置くだけでは足りず、条件分岐で片方だけ渡すこと。
    expect(cn("rounded-[9px]", "rounded-control")).toBe(
      "rounded-[9px] rounded-control",
    );
  });
});
