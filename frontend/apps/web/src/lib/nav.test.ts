import { describe, expect, it } from "vitest";
import { ALL_NAV_ITEMS, MOBILE_TABS, NAV_GROUPS } from "./nav";

describe("nav", () => {
  it("各アイテムの groupLabel に所属グループ名が入る", () => {
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        expect(item.groupLabel).toBe(group.label);
      }
    }
  });

  it("ALL_NAV_ITEMS は全グループを平坦化したもの", () => {
    const total = NAV_GROUPS.reduce((n, g) => n + g.items.length, 0);
    expect(ALL_NAV_ITEMS).toHaveLength(total);
    expect(ALL_NAV_ITEMS.map((i) => i.to)).toContain("/today");
  });

  it("ルートが重複していない", () => {
    const routes = ALL_NAV_ITEMS.map((i) => i.to);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("モバイルタブは 5 つで、行き先がサイドナビに存在する", () => {
    const routes = new Set(ALL_NAV_ITEMS.map((i) => i.to));
    expect(MOBILE_TABS).toHaveLength(5);
    for (const tab of MOBILE_TABS) {
      expect(routes.has(tab.to)).toBe(true);
    }
  });

  it("すべての to が絶対パスで、label が空でない", () => {
    for (const item of ALL_NAV_ITEMS) {
      expect(item.to.startsWith("/")).toBe(true);
      expect(item.label.length).toBeGreaterThan(0);
    }
  });
});
