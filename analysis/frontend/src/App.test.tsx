import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { App } from "./App";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App", () => {
  it('"/" で Placeholder の見出しを描画する', () => {
    renderAt("/");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("SelfSketch Analysis");
  });

  it("準備中の説明文と backend への参照を描画する", () => {
    renderAt("/");

    const description = screen.getByText(/分析ダッシュボード（準備中）/, { selector: "p" });
    expect(description).toHaveTextContent(
      "分析ダッシュボード（準備中）。API は analysis/backend（FastAPI）から配信予定。",
    );

    // FastAPI 側のパスは <code> でマークアップされている
    const code = screen.getByText("analysis/backend");
    expect(code.tagName).toBe("CODE");
    expect(description).toContainElement(code);
  });

  it("ルート要素は main で、見出しは 1 つだけ", () => {
    const { container } = renderAt("/");

    expect(container.firstElementChild?.tagName).toBe("MAIN");
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("未定義のパスでは何も描画しない", () => {
    const { container } = renderAt("/does-not-exist");

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
