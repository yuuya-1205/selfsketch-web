import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton, SkeletonGroup } from "./Skeleton";

describe("SkeletonGroup", () => {
  it("読み込み中であることを読み上げに伝える", () => {
    render(
      <SkeletonGroup>
        <Skeleton className="h-16" />
      </SkeletonGroup>,
    );
    const group = screen.getByRole("status");
    expect(group.getAttribute("aria-label")).toBe("読み込み中");
    expect(group.getAttribute("aria-live")).toBe("polite");
  });

  it("ラベルを差し替えられる", () => {
    render(
      <SkeletonGroup label="習慣を読み込み中">
        <Skeleton />
      </SkeletonGroup>,
    );
    expect(screen.getByRole("status").getAttribute("aria-label")).toBe(
      "習慣を読み込み中",
    );
  });

  it("アニメーションは箱側だけが持ち、個々の枠は装飾扱いにする", () => {
    const { container } = render(
      <SkeletonGroup>
        <Skeleton className="h-16" />
      </SkeletonGroup>,
    );
    expect(screen.getByRole("status").className).toContain("animate-pulse");

    const block = container.querySelector("span")!;
    expect(block.className).not.toContain("animate-pulse");
    expect(block.className).toContain("h-16");
    expect(block.getAttribute("aria-hidden")).toBe("true");
  });
});
