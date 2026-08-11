/** `GET /api/v1/friends` / `GET /api/v1/friends/activities` のレスポンス型 */
export interface FriendDto {
  id: string;
  name: string;
  currentStreak: number;
}

export interface FriendListDto {
  data: FriendDto[];
  totalCount: number;
}

export interface FriendActivityDto {
  id: string;
  friend: { id: string; name: string };
  message: string;
  /** RFC 3339 / UTC */
  occurredAt: string;
  cheers: number;
  sharedWorkCount: number;
}
