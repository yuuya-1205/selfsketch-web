import type { Session, User } from "@/domain/model/auth";
import type { SessionDto, UserDto } from "@/data/dto/auth";

export function toUser(dto: UserDto): User {
  return {
    id: dto.id,
    email: dto.email,
    displayName: dto.displayName,
    emailVerified: dto.emailVerified,
    createdAt: new Date(dto.createdAt),
    onboardingCompletedAt: dto.onboardingCompletedAt
      ? new Date(dto.onboardingCompletedAt)
      : null,
  };
}

/**
 * トークンは意図的に捨てる。domain の Session が持つのは
 * 「誰が、いつまでログインしているか」だけで、トークンの保管と送出は
 * data/datasource の責務（`docs/api-contract.md` §3）。
 */
export function toSession(dto: SessionDto): Session {
  return {
    user: toUser(dto.user),
    expiresAt: new Date(dto.accessTokenExpiresAt),
  };
}
