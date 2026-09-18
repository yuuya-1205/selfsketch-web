import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("トップページ", () => {
  it("SelfSketch のレベル 1 の見出しが 1 つ表示される", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading.textContent).toMatch(/SelfSketch/);
  });
});
