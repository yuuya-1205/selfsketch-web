export interface Friend {
  id: string;
  name: string;
  /** 現在の連続日数。"14日連続" のような整形済み文字列は持たない */
  currentStreak: number;
}

export interface FriendList {
  /** 一覧に出す分だけ。全体の人数は totalCount */
  items: Friend[];
  totalCount: number;
}

export interface FriendActivity {
  id: string;
  friend: { id: string; name: string };
  /**
   * 何が起きたかの本文。これはサーバが持つ「内容」であって整形ではないので、
   * 文字列のまま受け取る（相対時刻や件数の整形は含めない）。
   */
  message: string;
  /** 起きた日時。"2時間前" をサーバに焼き込ませない（api-contract.md §1） */
  occurredAt: Date;
  cheers: number;
  /** この活動で共有された作品の数。0 なら添付なし */
  sharedWorkCount: number;
}

/** 新しい順。同着は id で安定させる */
export function sortByRecency(activities: FriendActivity[]): FriendActivity[] {
  return [...activities].sort((a, b) => {
    const diff = b.occurredAt.getTime() - a.occurredAt.getTime();
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });
}
