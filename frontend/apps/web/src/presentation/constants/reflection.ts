import {
  GitCompare,
  Infinity as InfinityIcon,
  LayoutGrid,
  Milestone,
  Route,
  Sunrise,
  type LucideIcon,
} from "lucide-react";
import type { ReflectionKind } from "@/domain/model/reflection";

export interface ReflectionMeta {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * 入口の見た目。domain は kind しか持たないので、行き先とアイコンはここが持つ。
 * 並び順は `.pen` W-Rf 1 に合わせる。
 */
export const REFLECTION_META: Record<ReflectionKind, ReflectionMeta> = {
  daily: {
    to: "/reflection/daily",
    icon: Sunrise,
    title: "今日のリフレクション",
    description: "3つの問いに答えて、1日を締めくくる",
  },
  comparison: {
    to: "/reflection/compare",
    icon: GitCompare,
    title: "6か月前の自分と比べる",
    description: "記録・作品・言葉の変化を並べて見る",
  },
  timeline: {
    to: "/reflection/timeline",
    icon: Milestone,
    title: "未来タイムライン",
    description: "1年 / 3年 / 10年の自分を一本の線で見る",
  },
  century: {
    to: "/reflection/century",
    icon: InfinityIcon,
    title: "100年ライフ",
    description: "人生を100マスにして、いまの位置を確かめる",
  },
  backcast: {
    to: "/reflection/backcast",
    icon: Route,
    title: "逆算プラン",
    description: "10年後から今日までを逆算して分解する",
  },
  vision: {
    to: "/reflection/vision",
    icon: LayoutGrid,
    title: "ビジョンボード",
    description: "なりたい姿を1枚のボードにまとめる",
  },
};
