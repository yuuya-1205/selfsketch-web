import { money, type Money } from "@/domain/model/money";

export interface PremiumPlan {
  name: string;
  price: Money;
  /** 価格の下に添える期間の説明 */
  per: string;
  description: string;
  features: string[];
  primary: boolean;
  badge: string | null;
  cta: string;
}

/**
 * 料金プラン（`.pen` W-Premium 1）。
 * いまは静的な販促文言なので presentation に置く。実際に課金を通すときは
 * サーバから引く（価格が変わってもアプリの再デプロイを要らなくするため）。
 */
export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    name: "Free",
    price: money(0),
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
    badge: null,
    cta: "現在のプラン",
  },
  {
    name: "Premium",
    price: money(9800),
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

export const EXPORT_TARGET_OPTIONS = ["all", "journal", "artwork"] as const;
export const EXPORT_FORMAT_OPTIONS = ["json", "csv", "zip"] as const;
