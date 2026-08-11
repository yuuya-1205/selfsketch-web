import { sortByRecency } from "@/domain/model/social";
import { useRepositories } from "@/presentation/di/repositories";

/** フレンドのうごき。並び順はサーバに頼らずここで決める */
export function useFriendFeed() {
  const { data, isLoading, error, retry } = useRepositories().social.useFeed();

  return {
    activities: data && sortByRecency(data),
    isLoading,
    error,
    retry,
  };
}

export function useFriends() {
  const { data, isLoading, error, retry } =
    useRepositories().social.useFriends();

  return {
    friends: data?.items,
    friendCount: data?.totalCount ?? 0,
    isLoading,
    error,
    retry,
  };
}

export function useCheer() {
  return useRepositories().social.useCheer();
}
