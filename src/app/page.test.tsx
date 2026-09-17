import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("トップページ", () => {
  it("レベル 1 の見出しが 1 つあり、始め方を案内している", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading.textContent).toMatch(/To get started/);
  });
});
