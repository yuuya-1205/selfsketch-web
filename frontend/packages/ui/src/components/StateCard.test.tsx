import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState, ErrorState, InlineError } from "./StateCard";

describe("ErrorState", () => {
  it("見出しと本文と操作を出す", () => {
    render(
      <ErrorState
        icon={<span data-testid="icon" />}
        title="つながりませんでした"
        body="電波の良いところで、もう一度お試しください。"
        actions={<button type="button">再試行</button>}
      />,
    );

    expect(screen.getByText("つながりませんでした")).toBeTruthy();
    expect(screen.getByTestId("icon")).toBeTruthy();
    expect(screen.getByRole("button", { name: "再試行" })).toBeTruthy();
  });

  it("本文と操作は省ける", () => {
    render(<ErrorState icon={null} title="うまくいきませんでした。" />);
    expect(screen.getByText("うまくいきませんでした。")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("EmptyState", () => {
  it("次の一歩を操作として置ける", () => {
    render(
      <EmptyState
        icon={null}
        title="今日はここから"
        body="習慣をひとつ決めると、明日から残ります。"
        actions={<button type="button">最初の習慣をつくる</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "最初の習慣をつくる" }),
    ).toBeTruthy();
  });
});

describe("InlineError", () => {
  it("tone で枠線の色を変える", () => {
    const { container, rerender } = render(
      <InlineError icon={null} title="この区画を読み込めませんでした" />,
    );
    expect(container.firstElementChild?.className).toContain("border-warn");

    rerender(
      <InlineError
        icon={null}
        title="ログインの有効期限が切れました"
        tone="danger"
      />,
    );
    expect(container.firstElementChild?.className).toContain("border-danger");
  });
});
