import {
  CreditCard,
  Cpu,
  KeyRound,
  LayoutDashboard,
  ScrollText,
  Send,
  Settings,
  ShieldAlert,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  groupLabel: string;
}

function group(label: string, items: Omit<AdminNavItem, "groupLabel">[]) {
  return { label, items: items.map((i) => ({ ...i, groupLabel: label })) };
}

/** .pen の "Admin Sidebar" と 1:1 */
export const ADMIN_NAV_GROUPS = [
  group("運用", [
    { to: "/overview", label: "概要", icon: LayoutDashboard },
    { to: "/users", label: "ユーザー", icon: Users },
    { to: "/moderation", label: "コンテンツ審査", icon: ShieldAlert },
    { to: "/ai", label: "AI モニタリング", icon: Cpu },
  ]),
  group("ビジネス", [
    { to: "/revenue", label: "売上・課金", icon: CreditCard },
    { to: "/delivery", label: "配信・お知らせ", icon: Send },
  ]),
  group("管理", [
    { to: "/audit", label: "監査ログ", icon: ScrollText },
    { to: "/members", label: "権限・メンバー", icon: KeyRound },
    { to: "/settings", label: "設定", icon: Settings },
  ]),
];

export const ALL_ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap(
  (g) => g.items,
);
