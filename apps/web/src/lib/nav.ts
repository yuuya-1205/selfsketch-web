import {
  Bell,
  BookOpen,
  CircleUser,
  Flame,
  Image,
  Moon,
  Settings,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** 所属グループ名（トップバーのパンくずに使う） */
  groupLabel: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

function group(label: string, items: Omit<NavItem, "groupLabel">[]): NavGroup {
  return { label, items: items.map((i) => ({ ...i, groupLabel: label })) };
}

/** サイドナビの構成。.pen の "Web Sidebar" コンポーネントと 1:1 */
export const NAV_GROUPS: NavGroup[] = [
  group("メイン", [
    { to: "/today", label: "今日", icon: Sun },
    { to: "/journal", label: "ジャーナル", icon: BookOpen },
    { to: "/streak", label: "軌跡", icon: Flame },
    { to: "/gallery", label: "ギャラリー", icon: Image },
    { to: "/future", label: "未来の自分", icon: Moon },
  ]),
  group("分析・つながり", [
    { to: "/insights", label: "インサイト", icon: TrendingUp },
    { to: "/reflection", label: "リフレクション", icon: Sparkles },
    { to: "/friends", label: "フレンド", icon: Users },
  ]),
  group("その他", [
    { to: "/notifications", label: "通知", icon: Bell },
    { to: "/settings", label: "設定", icon: Settings },
  ]),
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

/** モバイルWeb の下部タブ。アプリのタブバーと同じ5つ */
export const MOBILE_TABS: NavItem[] = [
  { to: "/today", label: "今日", icon: Sun, groupLabel: "メイン" },
  { to: "/journal", label: "ジャーナル", icon: BookOpen, groupLabel: "メイン" },
  { to: "/streak", label: "軌跡", icon: Flame, groupLabel: "メイン" },
  { to: "/future", label: "未来", icon: Moon, groupLabel: "メイン" },
  { to: "/settings", label: "自分", icon: CircleUser, groupLabel: "その他" },
];
