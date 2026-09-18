import { expect, test } from "@playwright/test";

test.describe("トップページ", () => {
  test("開くと始め方を案内する見出しが見える", async ({ page }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1 });

    await expect(heading).toBeVisible();
    await expect(heading).toContainText("SelfSketch");
  });
});
