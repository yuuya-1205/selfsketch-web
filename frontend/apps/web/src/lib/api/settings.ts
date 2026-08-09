import { useMockQuery } from "./client";
import type { Invoice, UsageMeter } from "./types";

export const SETTINGS_NAV = [
  { to: "/settings", label: "一般" },
  { to: "/settings/account", label: "アカウント" },
  { to: "/notifications", label: "通知" },
  { to: "/settings/privacy", label: "プライバシー" },
  { to: "/settings/subscription", label: "サブスクリプション" },
  { to: "/settings/data", label: "データと書き出し" },
  { to: "/settings/help", label: "ヘルプ" },
];

const USAGE: UsageMeter[] = [
  {
    label: "AI 未来生成",
    value: "3 / 5",
    ratio: 0.6,
    note: "今月のリセットまで あと 8日",
  },
  {
    label: "保存できる作品",
    value: "42 / 100",
    ratio: 0.42,
    note: "上限まで あと 58点",
  },
  { label: "書き出し", value: "0 / 1", ratio: 0, note: "月に1回まで" },
];

const INVOICES: Invoice[] = [
  {
    date: "2026/04/01",
    description: "Premium 月額プラン",
    amount: "¥980",
    status: "お支払い済み",
  },
  {
    date: "2026/03/01",
    description: "Premium 月額プラン",
    amount: "¥980",
    status: "お支払い済み",
  },
  {
    date: "2026/02/01",
    description: "Premium 月額プラン",
    amount: "¥980",
    status: "返金",
  },
];

export function useUsage() {
  return useMockQuery(["settings", "usage"], USAGE);
}

export function useInvoices() {
  return useMockQuery(["settings", "invoices"], INVOICES);
}

export const PREMIUM_PLANS = [
  {
    name: "Free",
    price: "¥0",
    per: "/ ずっと",
    description:
      "まずは続けてみるためのプラン。基本の記録機能はすべて使えます。",
    features: [
      "習慣は3つまで",
      "AI未来生成 月5回",
      "作品保存 100点",
      "ジャーナル無制限",
      "フレンド 10人まで",
    ],
    primary: false,
    badge: null as string | null,
    cta: "現在のプラン",
  },
  {
    name: "Premium",
    price: "¥9,800",
    per: "/ 年 (月あたり ¥816)",
    description: "続けると決めた人のためのプラン。制限をすべて外します。",
    features: [
      "習慣は無制限",
      "AI未来生成 無制限・履歴も保存",
      "作品保存 無制限 + 高解像度書き出し",
      "6か月/1年/10年 の比較ビュー",
      "100年ライフ・逆算プラン",
      "CSV / PDF エクスポート (Web版)",
      "広告なし・優先サポート",
    ],
    primary: true,
    badge: "おすすめ",
    cta: "7日間の無料体験をはじめる",
  },
];
