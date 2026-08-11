import type { FriendActivity, FriendList } from "@/domain/model/social";
import type { RepositoryResult } from "./result";

export interface SocialRepository {
  useFeed(): RepositoryResult<FriendActivity[]>;
  useFriends(): RepositoryResult<FriendList>;
  /** 活動をはげます */
  useCheer(): (activityId: string) => Promise<void>;
}
