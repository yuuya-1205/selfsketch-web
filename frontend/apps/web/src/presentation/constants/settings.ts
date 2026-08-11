import type { UsageMeterId } from "@/domain/model/billing";
import type {
  ExportFormat,
  ExportStatus,
  ExportTarget,
  StorageUsage,
  Visibility,
} from "@/domain/model/settings";
import type { InvoiceStatus } from "@/domain/model/billing";

export const SETTINGS_NAV = [
  { to: "/settings", label: "一般" },
  { to: "/settings/account", label: "アカウント" },
  { to: "/notifications", label: "通知" },
  { to: "/settings/privacy", label: "プライバシー" },
  { to: "/settings/subscription", label: "サブスクリプション" },
  { to: "/settings/data", label: "データと書き出し" },
  { to: "/settings/help", label: "ヘルプ" },
];

/** 公開範囲のラベル。`.pen` W-Set 4 のセレクトと 1:1 */
export const VISIBILITY_LABEL: Record<Visibility, string> = {
  public: "全体に公開",
  friends: "フレンドのみ",
  private: "自分だけ",
};

export const VISIBILITY_OPTIONS: Visibility[] = [
  "public",
  "friends",
  "private",
];

export const EXPORT_TARGET_LABEL: Record<ExportTarget, string> = {
  all: "すべてのデータ",
  journal: "ジャーナルのみ",
  artwork: "作品画像のみ",
};

export const EXPORT_FORMAT_LABEL: Record<ExportFormat, string> = {
  json: "JSON (構造を保持)",
  csv: "CSV (表計算で開ける)",
  zip: "ZIP (画像のみ)",
};

/** 履歴の行に出す短い形式名 */
export const EXPORT_FORMAT_SHORT: Record<ExportFormat, string> = {
  json: "JSON",
  csv: "CSV",
  zip: "ZIP",
};

export const EXPORT_STATUS_LABEL: Record<ExportStatus, string> = {
  ready: "準備完了",
  preparing: "作成中",
  expired: "期限切れ",
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "お支払い済み",
  refunded: "返金",
  failed: "失敗",
};

export const USAGE_METER_LABEL: Record<UsageMeterId, string> = {
  future_generation: "AI 未来生成",
  artwork_storage: "保存できる作品",
  export: "書き出し",
};

export const STORAGE_LABEL: Record<StorageUsage["kind"], string> = {
  artwork: "作品画像",
  records: "ジャーナルと記録",
};
