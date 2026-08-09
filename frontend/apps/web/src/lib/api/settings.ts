import { baseApi, mockDelay } from "./baseApi";
import type {
  DataSettings,
  HelpSettings,
  Invoice,
  PrivacySettings,
  UsageMeter,
} from "./types";

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

/* ---- プライバシー（W-Set 4） --------------------------------------- */
export const VISIBILITY_OPTIONS = [
  "全体に公開",
  "フレンドのみ",
  "自分だけ",
] as const;

const PRIVACY: PrivacySettings = {
  profile: "フレンドのみ",
  gallery: "フレンドのみ",
  shareStreak: true,
  shareJournal: false,
  acceptFriendRequests: true,
  discoverable: true,
  aiTraining: false,
  anonymousStats: true,
  blockedUsers: 2,
  mutedKeywords: 5,
};

/* ---- データと書き出し（W-Set 5） ----------------------------------- */
export const EXPORT_TARGETS = [
  "すべてのデータ",
  "ジャーナルのみ",
  "作品画像のみ",
] as const;

export const EXPORT_FORMATS = [
  "JSON (構造を保持)",
  "CSV (表計算で開ける)",
  "ZIP (画像のみ)",
] as const;

const DATA: DataSettings = {
  history: [
    {
      date: "2026/04/02",
      target: "すべてのデータ (JSON)",
      status: "準備完了",
      downloadUrl: "#",
    },
    {
      date: "2026/03/01",
      target: "ジャーナル (CSV)",
      status: "期限切れ",
      downloadUrl: null,
    },
    {
      date: "2026/01/14",
      target: "作品画像 (ZIP)",
      status: "期限切れ",
      downloadUrl: null,
    },
  ],
  storage: [
    { label: "作品画像", used: "420MB / 1GB", ratio: 0.42 },
    { label: "ジャーナルと記録", used: "12MB / 1GB", ratio: 0.012 },
  ],
  canRequestExport: true,
  nextExportAvailableAt: "2026/05/02",
};

/* ---- ヘルプ（W-Set 6） --------------------------------------------- */
const HELP: HelpSettings = {
  faqs: [
    {
      question: "習慣はいくつまで作れますか？",
      answer:
        "Free プランは3つまで、Premium は無制限です。上限に達していても、既存の習慣を保存したまま入れ替えられます。",
    },
    {
      question: "「未来の自分」は何をもとに生成されますか？",
      answer:
        "オンボーディングで書いた目標と、直近90日の習慣の達成状況から生成します。ジャーナルの本文は使いません。",
    },
    {
      question: "間違えて消した記録は戻せますか？",
      answer:
        "削除から30日間はゴミ箱に残っています。設定 › データと書き出し から復元できます。",
    },
    {
      question: "機種変更してもデータは引き継がれますか？",
      answer:
        "同じアカウントでログインすれば自動で引き継がれます。事前の書き出しは不要です。",
    },
  ],
  links: [
    { label: "使い方ガイド", href: "#" },
    { label: "利用規約", href: "#" },
    { label: "プライバシーポリシー", href: "#" },
    { label: "ライセンス表記", href: "#" },
  ],
  responseTime: "平日 2営業日以内",
  version: "1.4.0 (Web)",
  updatedAt: "2026/04/08",
  supportId: "SS-8F2K-4N71",
};

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    privacySettings: build.query<PrivacySettings, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: PRIVACY };
      },
      providesTags: [{ type: "Settings", id: "privacy" }],
    }),

    dataSettings: build.query<DataSettings, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: DATA };
      },
      providesTags: [{ type: "Settings", id: "data" }],
    }),

    helpSettings: build.query<HelpSettings, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: HELP };
      },
      providesTags: [{ type: "Settings", id: "help" }],
    }),

    usage: build.query<UsageMeter[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: USAGE };
      },
      providesTags: [{ type: "Settings", id: "usage" }],
    }),

    invoices: build.query<Invoice[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: INVOICES };
      },
      providesTags: [{ type: "Settings", id: "invoices" }],
    }),
  }),
});

export const {
  usePrivacySettingsQuery,
  useDataSettingsQuery,
  useHelpSettingsQuery,
  useUsageQuery,
  useInvoicesQuery,
} = settingsApi;

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
