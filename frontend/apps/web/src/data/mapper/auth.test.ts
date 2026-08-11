import { describe, expect, it } from "vitest";
import type { SessionDto } from "@/data/dto/auth";
import { toSession, toUser } from "./auth";

const DTO: SessionDto = {
  accessToken: "header.payload.signature",
  accessTokenExpiresAt: "2026-04-22T01:00:00Z",
  refreshToken: "r-1",
  user: {
    id: "u1",
    email: "yuki@example.com",
    displayName: "ゆうき",
    emailVerified: true,
    createdAt: "2025-11-01T15:00:00Z",
    onboardingCompletedAt: "2025-11-01T15:12:00Z",
  },
};

describe("toUser", () => {
  it("日時を Date にする", () => {
    const user = toUser(DTO.user);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.createdAt.toISOString()).toBe("2025-11-01T15:00:00.000Z");
    expect(user.onboardingCompletedAt?.toISOString()).toBe(
      "2025-11-01T15:12:00.000Z",
    );
  });

  it("オンボーディング未完了は null のまま", () => {
    expect(
      toUser({ ...DTO.user, onboardingCompletedAt: null })
        .onboardingCompletedAt,
    ).toBeNull();
  });
});

describe("toSession", () => {
  it("失効時刻を Date にする", () => {
    expect(toSession(DTO).expiresAt.toISOString()).toBe(
      "2026-04-22T01:00:00.000Z",
    );
  });

  it("トークンをドメインモデルに漏らさない", () => {
    const session = toSession(DTO);
    expect(JSON.stringify(session)).not.toContain(DTO.accessToken);
    expect(JSON.stringify(session)).not.toContain(DTO.refreshToken);
  });

  it("ユーザーはそのまま載せる", () => {
    expect(toSession(DTO).user.email).toBe("yuki@example.com");
  });
});
