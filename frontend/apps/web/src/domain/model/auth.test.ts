import { describe, expect, it } from "vitest";
import {
  displayNameIssue,
  emailIssue,
  hasCompletedOnboarding,
  isSessionExpired,
  passwordIssue,
  type Session,
  type User,
} from "./auth";

const USER: User = {
  id: "u1",
  email: "yuki@example.com",
  displayName: "ゆうき",
  emailVerified: false,
  createdAt: new Date("2025-11-01T15:00:00Z"),
  onboardingCompletedAt: null,
};

describe("hasCompletedOnboarding", () => {
  it("完了日時が無ければ未完了", () => {
    expect(hasCompletedOnboarding(USER)).toBe(false);
  });

  it("完了日時があれば完了", () => {
    expect(
      hasCompletedOnboarding({
        ...USER,
        onboardingCompletedAt: new Date("2025-11-01T15:10:00Z"),
      }),
    ).toBe(true);
  });
});

describe("isSessionExpired", () => {
  const session: Session = {
    user: USER,
    expiresAt: new Date("2026-04-22T00:00:00Z"),
  };

  it("失効時刻より前なら有効", () => {
    expect(isSessionExpired(session, new Date("2026-04-21T23:59:59Z"))).toBe(
      false,
    );
  });

  it("失効時刻ちょうどは失効とみなす", () => {
    expect(isSessionExpired(session, new Date("2026-04-22T00:00:00Z"))).toBe(
      true,
    );
  });
});

describe("emailIssue", () => {
  it.each([
    ["", "email_required"],
    ["   ", "email_required"],
    ["yuki", "email_invalid"],
    ["yuki@example", "email_invalid"],
    ["yuki example@test.com", "email_invalid"],
  ])("%s は %s", (input, expected) => {
    expect(emailIssue(input)).toBe(expected);
  });

  it("前後の空白は許す", () => {
    expect(emailIssue(" yuki@example.com ")).toBeNull();
  });
});

describe("passwordIssue", () => {
  it("空はエラー", () => {
    expect(passwordIssue("")).toBe("password_required");
  });

  it("8文字未満は短すぎる", () => {
    expect(passwordIssue("1234567")).toBe("password_too_short");
  });

  it("8文字ちょうどは通す", () => {
    expect(passwordIssue("12345678")).toBeNull();
  });
});

describe("displayNameIssue", () => {
  it("空白だけはエラー", () => {
    expect(displayNameIssue("  ")).toBe("display_name_required");
  });

  it("文字があれば通す", () => {
    expect(displayNameIssue("ゆうき")).toBeNull();
  });
});
