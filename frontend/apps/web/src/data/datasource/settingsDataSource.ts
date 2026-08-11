import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type {
  DataSettingsDto,
  HelpSettingsDto,
  PrivacySettingsDto,
} from "@/data/dto/settings";

/* ------------------------------------------------------------------ *
 * モック。差し替え手順は baseApi.ts のコメントを参照。
 *   GET /api/v1/me/settings/privacy
 *   GET /api/v1/me/settings/data
 *   GET /api/v1/me/settings/help
 * ------------------------------------------------------------------ */

const GIB = 1_073_741_824;
const MIB = 1_048_576;

const PRIVACY: PrivacySettingsDto = {
  profile: "friends",
  gallery: "friends",
  shareStreak: true,
  shareJournal: false,
  acceptFriendRequests: true,
  discoverable: true,
  aiTraining: false,
  anonymousStats: true,
  blockedUsers: 2,
  mutedKeywords: 5,
};

const DATA: DataSettingsDto = {
  history: [
    {
      id: "e1",
      requestedAt: "2026-04-01T15:00:00Z",
      target: "all",
      format: "json",
      status: "ready",
      downloadUrl: "#",
    },
    {
      id: "e2",
      requestedAt: "2026-02-28T15:00:00Z",
      target: "journal",
      format: "csv",
      status: "expired",
      downloadUrl: null,
    },
    {
      id: "e3",
      requestedAt: "2026-01-13T15:00:00Z",
      target: "artwork",
      format: "zip",
      status: "expired",
      downloadUrl: null,
    },
  ],
  storage: [
    { kind: "artwork", usedBytes: 420 * MIB, limitBytes: GIB },
    { kind: "records", usedBytes: 12 * MIB, limitBytes: GIB },
  ],
  canRequestExport: true,
  nextExportAvailableAt: "2026-05-01T15:00:00Z",
};

const HELP: HelpSettingsDto = {
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
  responseBusinessDays: 2,
  version: "1.4.0 (Web)",
  updatedAt: "2026-04-07T15:00:00Z",
  supportId: "SS-8F2K-4N71",
};

/* ------------------------------------------------------------------ */

export const settingsDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    privacySettings: build.query<PrivacySettingsDto, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: structuredClone(PRIVACY) };
      },
      providesTags: [{ type: "Settings", id: "privacy" }],
    }),

    dataSettings: build.query<DataSettingsDto, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: structuredClone(DATA) };
      },
      providesTags: [{ type: "Settings", id: "data" }],
    }),

    helpSettings: build.query<HelpSettingsDto, void>({
      queryFn: async () => {
        await mockDelay();
        return { data: structuredClone(HELP) };
      },
      providesTags: [{ type: "Settings", id: "help" }],
    }),
  }),
});
