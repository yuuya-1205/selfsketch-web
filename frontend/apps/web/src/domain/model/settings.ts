/** 公開範囲。表示ラベルは presentation の辞書が持つ */
export type Visibility = "public" | "friends" | "private";

export interface PrivacySettings {
  profile: Visibility;
  gallery: Visibility;
  shareStreak: boolean;
  shareJournal: boolean;
  acceptFriendRequests: boolean;
  discoverable: boolean;
  /** 生成した未来の自分を匿名化してモデル調整に使う */
  aiTraining: boolean;
  anonymousStats: boolean;
  blockedUsers: number;
  mutedKeywords: number;
}

export type ExportStatus = "ready" | "preparing" | "expired";
export type ExportTarget = "all" | "journal" | "artwork";
export type ExportFormat = "json" | "csv" | "zip";

export interface ExportRecord {
  id: string;
  requestedAt: Date;
  target: ExportTarget;
  format: ExportFormat;
  status: ExportStatus;
  /** 期限切れなら null */
  downloadUrl: string | null;
}

export interface StorageUsage {
  kind: "artwork" | "records";
  usedBytes: number;
  limitBytes: number;
}

export interface DataSettings {
  history: ExportRecord[];
  storage: StorageUsage[];
  canRequestExport: boolean;
  /** 次に書き出しを頼める日。いま頼めるなら null */
  nextExportAvailableAt: Date | null;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface HelpLink {
  label: string;
  href: string;
}

export interface HelpSettings {
  faqs: Faq[];
  links: HelpLink[];
  /** 問い合わせの一次返信までの営業日数 */
  responseBusinessDays: number;
  version: string;
  updatedAt: Date;
  supportId: string;
}

/** 0–1。上限が 0 なら 0 とみなす */
export function usageRatio(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(1, used / limit);
}

export function storageRatio(usage: StorageUsage): number {
  return usageRatio(usage.usedBytes, usage.limitBytes);
}
