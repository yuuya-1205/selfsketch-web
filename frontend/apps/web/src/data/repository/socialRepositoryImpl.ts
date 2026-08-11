import type { SocialRepository } from "@/domain/repository/socialRepository";
import { socialDataSource } from "@/data/datasource/socialDataSource";
import { toDomainError } from "@/data/mapper/error";
import { toFriendActivities, toFriendList } from "@/data/mapper/social";

export const socialRepository: SocialRepository = {
  useFeed() {
    const { data, isLoading, error, refetch } =
      socialDataSource.useFriendFeedQuery();
    return {
      data: data && toFriendActivities(data),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },

  useFriends() {
    const { data, isLoading, error, refetch } =
      socialDataSource.useFriendsQuery();
    return {
      data: data && toFriendList(data),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },

  useCheer() {
    const [cheer] = socialDataSource.useCheerMutation();
    return async (activityId) => {
      await cheer({ activityId }).unwrap();
    };
  },
};
