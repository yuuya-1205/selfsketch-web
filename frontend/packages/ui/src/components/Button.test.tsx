import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("children を描画し、既定で type=button になる", () => {
    render(<Button>保存する</Button>);
    const button = screen.getByRole("button", { name: "保存する" });
    expect(button.getAttribute("type")).toBe("button");
  });

  it("variant / size に対応したクラスを当てる", () => {
    render(
      <Button variant="outline" size="lg">
        続ける
      </Button>,
    );
    const button = screen.getByRole("button", { name: "続ける" });
    expect(button.className).toContain("border-line-strong");
    expect(button.className).toContain("h-12");
    // 既定の primary スタイルは残らない
    expect(button.className).not.toContain("bg-ink ");
  });

  it("disabled のときクリックハンドラを呼ばない", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        送信
      </Button>,
    );
    const button = screen.getByRole("button", { name: "送信" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("block と className を反映する", () => {
    render(<Button block className="mt-4" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("w-full");
    expect(button.className).toContain("mt-4");
  });

  it("icon を children の前に描画する", () => {
    render(<Button icon={<span data-testid="icon" />}>追加</Button>);
    const button = screen.getByRole("button", { name: "追加" });
    expect(button.firstElementChild?.getAttribute("data-testid")).toBe("icon");
  });
});
