import type { Friend, FriendActivity, FriendList } from "@/domain/model/social";
import type {
  FriendActivityDto,
  FriendDto,
  FriendListDto,
} from "@/data/dto/social";

export function toFriend(dto: FriendDto): Friend {
  return { id: dto.id, name: dto.name, currentStreak: dto.currentStreak };
}

export function toFriendList(dto: FriendListDto): FriendList {
  return { items: dto.data.map(toFriend), totalCount: dto.totalCount };
}

export function toFriendActivity(dto: FriendActivityDto): FriendActivity {
  return {
    id: dto.id,
    friend: { id: dto.friend.id, name: dto.friend.name },
    message: dto.message,
    occurredAt: new Date(dto.occurredAt),
    cheers: dto.cheers,
    sharedWorkCount: dto.sharedWorkCount,
  };
}

export function toFriendActivities(
  dtos: FriendActivityDto[],
): FriendActivity[] {
  return dtos.map(toFriendActivity);
}
