import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("既定の tone は neutral", () => {
    render(<Badge>下書き</Badge>);
    const badge = screen.getByText("下書き");
    expect(badge.tagName).toBe("SPAN");
    expect(badge.className).toContain("bg-surface");
    expect(badge.className).toContain("rounded-full");
  });

  it("tone ごとに配色クラスを切り替える", () => {
    render(<Badge tone="danger">停止中</Badge>);
    const badge = screen.getByText("停止中");
    expect(badge.className).toContain("bg-danger-bg");
    expect(badge.className).toContain("text-danger");
    expect(badge.className).not.toContain("bg-surface");
  });

  it("追加の className と任意の属性を通す", () => {
    render(
      <Badge className="ml-2" title="継続日数">
        7日
      </Badge>,
    );
    const badge = screen.getByText("7日");
    expect(badge.className).toContain("ml-2");
    expect(badge.getAttribute("title")).toBe("継続日数");
  });
});
