import { describe, expect, it } from "vitest";
import type { NotificationDto } from "@/data/dto/notification";
import { toNotification, toNotifications } from "./notification";

const DTO: NotificationDto = {
  id: "n1",
  title: "今日の5分スケッチの時間です",
  category: "reminder",
  receivedAt: "2026-04-21T22:00:00Z",
  read: false,
};

describe("toNotification", () => {
  it("受信日時を Date にする", () => {
    const n = toNotification(DTO);
    expect(n.receivedAt).toBeInstanceOf(Date);
    expect(n.receivedAt.toISOString()).toBe("2026-04-21T22:00:00.000Z");
  });

  it("種類は enum のまま持つ（日本語ラベルにしない）", () => {
    expect(toNotification(DTO).category).toBe("reminder");
  });

  it("既読フラグをそのまま写す", () => {
    expect(toNotification({ ...DTO, read: true }).read).toBe(true);
  });
});

describe("toNotifications", () => {
  it("並び順を変えない", () => {
    const list = toNotifications([DTO, { ...DTO, id: "n2" }]);
    expect(list.map((n) => n.id)).toEqual(["n1", "n2"]);
  });
});
