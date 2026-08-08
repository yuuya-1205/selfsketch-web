import { useMockQuery } from "./client";
import type { Friend, FriendActivity } from "./types";

const FEED: FriendActivity[] = [
  {
    id: "f1",
    initial: "み",
    name: "みお",
    action: "14日連続を達成しました",
    time: "2時間前",
    extra: "作品を1点シェア",
    cheers: 12,
  },
  {
    id: "f2",
    initial: "け",
    name: "けんた",
    action: "朝のランを 30日継続",
    time: "4時間前",
    extra: null,
    cheers: 8,
  },
  {
    id: "f3",
    initial: "さ",
    name: "さやか",
    action: "「読書メモ」を公開しました",
    time: "6時間前",
    extra: null,
    cheers: 3,
  },
  {
    id: "f4",
    initial: "ゆ",
    name: "ゆい",
    action: "3か月ぶりに再開しました",
    time: "昨日",
    extra: "作品を2点シェア",
    cheers: 24,
  },
];

const FRIENDS: Friend[] = [
  { initial: "み", name: "みお", streakLabel: "14日連続" },
  { initial: "け", name: "けんた", streakLabel: "30日連続" },
  { initial: "さ", name: "さやか", streakLabel: "6日連続" },
  { initial: "ゆ", name: "ゆい", streakLabel: "1日目" },
];

export const SHARE_TEMPLATES = ["ダーク", "ペーパー", "ミニマル"] as const;

export const SHARE_OPTIONS = [
  { label: "作品画像", enabled: true },
  { label: "連続日数", enabled: true },
  { label: "ジャーナル本文", enabled: false },
  { label: "フレンド数", enabled: false },
];

export function useFriendFeed() {
  return useMockQuery(["social", "feed"], FEED);
}

export function useFriends() {
  return useMockQuery(["social", "friends"], FRIENDS);
}
