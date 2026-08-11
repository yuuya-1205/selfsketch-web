/** `GET /api/v1/me/settings/*` のレスポンス型 */
export type VisibilityDto = "public" | "friends" | "private";

export interface PrivacySettingsDto {
  profile: VisibilityDto;
  gallery: VisibilityDto;
  shareStreak: boolean;
  shareJournal: boolean;
  acceptFriendRequests: boolean;
  discoverable: boolean;
  aiTraining: boolean;
  anonymousStats: boolean;
  blockedUsers: number;
  mutedKeywords: number;
}

export interface ExportRecordDto {
  id: string;
  /** RFC 3339 / UTC */
  requestedAt: string;
  target: "all" | "journal" | "artwork";
  format: "json" | "csv" | "zip";
  status: "ready" | "preparing" | "expired";
  downloadUrl: string | null;
}

export interface StorageUsageDto {
  kind: "artwork" | "records";
  usedBytes: number;
  limitBytes: number;
}

export interface DataSettingsDto {
  history: ExportRecordDto[];
  storage: StorageUsageDto[];
  canRequestExport: boolean;
  /** RFC 3339 / UTC。いま頼めるなら null */
  nextExportAvailableAt: string | null;
}

export interface HelpSettingsDto {
  faqs: { question: string; answer: string }[];
  links: { label: string; href: string }[];
  responseBusinessDays: number;
  version: string;
  /** RFC 3339 / UTC */
  updatedAt: string;
  supportId: string;
}
