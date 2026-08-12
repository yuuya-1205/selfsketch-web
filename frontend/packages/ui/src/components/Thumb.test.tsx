import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Thumb } from "./Thumb";

describe("Thumb", () => {
  it("画像が無ければ下地の色だけ出す", () => {
    const { container } = render(<Thumb seed={2} />);
    expect(container.querySelector("img")).toBeNull();
    expect(
      (container.firstElementChild as HTMLElement).style.backgroundColor,
    ).not.toBe("");
  });

  it("画像があれば出す", () => {
    render(<Thumb src="https://example.com/a.png" alt="スケッチ" />);
    expect(screen.getByRole("img", { name: "スケッチ" })).toBeTruthy();
  });

  it("読み込みに失敗したら下地の色に戻す", () => {
    const { container } = render(
      <Thumb src="https://example.com/broken.png" alt="スケッチ" seed={3} />,
    );

    fireEvent.error(screen.getByRole("img", { name: "スケッチ" }));

    // 壊れた URL で空の枠が残らない
    expect(container.querySelector("img")).toBeNull();
    expect(
      (container.firstElementChild as HTMLElement).style.backgroundColor,
    ).not.toBe("");
  });

  it("src が差し替わったら前の失敗を引きずらない", () => {
    const { container, rerender } = render(
      <Thumb src="https://example.com/broken.png" alt="スケッチ" />,
    );
    fireEvent.error(screen.getByRole("img", { name: "スケッチ" }));
    expect(container.querySelector("img")).toBeNull();

    rerender(<Thumb src="https://example.com/ok.png" alt="スケッチ" />);
    expect(container.querySelector("img")).not.toBeNull();
  });

  it("遅延読み込みにする", () => {
    const { container } = render(<Thumb src="https://example.com/a.png" />);
    expect(container.querySelector("img")?.getAttribute("loading")).toBe(
      "lazy",
    );
  });
});
