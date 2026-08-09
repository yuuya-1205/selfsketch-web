import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("0–1 の値を百分率にして aria と幅へ反映する", () => {
    render(<Progress value={0.25} label="今日の達成率" />);
    const bar = screen.getByRole("progressbar", { name: "今日の達成率" });
    expect(bar.getAttribute("aria-valuenow")).toBe("25");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
    expect((bar.firstElementChild as HTMLElement).style.width).toBe("25%");
  });

  it("範囲外の値を 0–100 にクランプする", () => {
    const { unmount } = render(<Progress value={1.8} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "100",
    );
    unmount();

    render(<Progress value={-3} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "0",
    );
  });

  it("inverse で溝と塗りの色が入れ替わる", () => {
    const { unmount } = render(<Progress value={0.5} />);
    const normal = screen.getByRole("progressbar");
    expect(normal.className).toContain("bg-track");
    expect(normal.firstElementChild?.className).toContain("bg-brown");
    unmount();

    render(<Progress value={0.5} inverse />);
    const inverse = screen.getByRole("progressbar");
    expect(inverse.className).toContain("bg-nav-active");
    expect(inverse.firstElementChild?.className).toContain("bg-line");
  });

  it("height を px として style に渡す", () => {
    render(<Progress value={0.5} height={12} />);
    expect((screen.getByRole("progressbar") as HTMLElement).style.height).toBe(
      "12px",
    );
  });
});
