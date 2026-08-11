/**
 * API 境界の型。
 * バックエンド（Go）実装後は OpenAPI / Protobuf から生成した型に差し替える。
 * UI 側はこのファイルだけを見ているので、影響範囲がここで閉じる。
 */

export type HabitSlot = "毎朝" | "起床後" | "昼" | "午後" | "夜" | "就寝前";

export interface Habit {
  id: string;
  title: string;
  meta: string;
  done: boolean;
  slot: HabitSlot;
}

export interface StreakSummary {
  current: number;
  longest: number;
  week: boolean[];
}

export interface FutureSelfSummary {
  title: string;
  remainingDays: number;
  progress: number;
  thumbnailUrl: string | null;
}

export interface TodayDashboard {
  dateLabel: string;
  completedCount: number;
  totalCount: number;
  habits: Habit[];
  streak: StreakSummary;
  future: FutureSelfSummary;
  todayQuote: string;
  weekCompletion: number[];
  sketchLogged: boolean;
}

/* ---- 習慣詳細 ----------------------------------------------------- */
export interface HabitDetail {
  id: string;
  title: string;
  schedule: string;
  duration: string;
  linkedVision: string | null;
  achievementRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCount: number;
  startedDaysAgo: number;
  /** 直近12週 × 7日、0–4 のレベル */
  heatmap: number[][];
  notes: { date: string; body: string }[];
}

/* ---- 軌跡 --------------------------------------------------------- */
export interface StreakPage {
  current: number;
  longest: number;
  monthlyRate: number;
  totalRecords: number;
  totalDays: number;
  yearHeatmap: number[][];
  weeklyRates: number[];
  nextMilestone: { label: string; remaining: number; progress: number };
  badges: { label: string; glyph: string; earned: boolean }[];
}

/* ---- ジャーナル ---------------------------------------------------- */
export interface JournalEntry {
  id: string;
  dateLabel: string;
  timeLabel: string;
  title: string;
  excerpt: string;
  body: string[];
  moodColor: string;
  hasImage: boolean;
  habit: string;
  mood: string;
  tags: string[];
  quote: string;
  stats: string[];
}

/* ---- ギャラリー ---------------------------------------------------- */
export interface GalleryItem {
  id: string;
  dateLabel: string;
  title: string;
  seed: number;
}

export interface GalleryMonth {
  label: string;
  summary: string;
  items: GalleryItem[];
}

/* ---- 未来の自分 ---------------------------------------------------- */
export interface VisionMilestone {
  when: string;
  title: string;
  reached: boolean;
}

export interface Vision {
  id: string;
  horizon: string;
  dateLabel: string;
  quote: string;
  body: string;
  progress: number;
  remainingDays: number;
  milestones: VisionMilestone[];
  habits: { title: string; rate: number }[];
  letter: string;
  story: string[];
  steps: { when: string; title: string; reached: boolean }[];
}

/* ---- インサイト ---------------------------------------------------- */
export interface InsightsData {
  kpis: {
    label: string;
    value: string;
    unit: string;
    delta: string;
    up: boolean;
  }[];
  monthlyRecordDays: number[];
  monthLabels: string[];
  habitRates: { title: string; rate: number }[];
  hourly: number[];
}

export interface MonthlyReport {
  monthLabel: string;
  headline: string;
  summary: string;
  stats: { label: string; value: string }[];
  highlights: { date: string; title: string; seed: number }[];
  findings: string[];
  suggestions: { title: string; reason: string }[];
  comparison: { label: string; prev: number; current: number }[];
}

/* ---- フレンド ------------------------------------------------------ */
export interface FriendActivity {
  id: string;
  initial: string;
  name: string;
  action: string;
  time: string;
  extra: string | null;
  cheers: number;
}

export interface Friend {
  initial: string;
  name: string;
  streakLabel: string;
}

/* ---- 通知 ---------------------------------------------------------- */
/* ---- 設定 ---------------------------------------------------------- */

/** 公開範囲を選ぶ設定の選択肢。`.pen` W-Set 4 のセレクトと 1:1 */
export type Visibility = "全体に公開" | "フレンドのみ" | "自分だけ";

export interface PrivacySettings {
  profile: Visibility;
  gallery: Visibility;
  /** 連続日数をフレンドのタイムラインに出す */
  shareStreak: boolean;
  /** 共有されるのは日付と気分だけで、本文は常に非公開 */
  shareJournal: boolean;
  acceptFriendRequests: boolean;
  discoverable: boolean;
  /** 生成した未来の自分を匿名化してモデル調整に使う */
  aiTraining: boolean;
  anonymousStats: boolean;
  blockedUsers: number;
  mutedKeywords: number;
}

export type ExportStatus = "準備完了" | "作成中" | "期限切れ";

export interface ExportRecord {
  date: string;
  target: string;
  status: ExportStatus;
  /** 期限切れなど、ダウンロードできないときは null */
  downloadUrl: string | null;
}

export interface StorageMeter {
  label: string;
  used: string;
  ratio: number;
}

export interface DataSettings {
  history: ExportRecord[];
  storage: StorageMeter[];
  /** 書き出しは月に1回まで。使い切っていると false */
  canRequestExport: boolean;
  nextExportAvailableAt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HelpLink {
  label: string;
  href: string;
}

export interface HelpSettings {
  faqs: FaqItem[];
  links: HelpLink[];
  /** 問い合わせの一次返信の目安 */
  responseTime: string;
  version: string;
  updatedAt: string;
  supportId: string;
}

export interface UsageMeter {
  label: string;
  value: string;
  ratio: number;
  note: string;
}

export interface Invoice {
  date: string;
  description: string;
  amount: string;
  status: "お支払い済み" | "返金";
}

/* ---- リフレクション ------------------------------------------------ */
export interface ReflectionEntryPoint {
  to: string;
  icon: string;
  title: string;
  description: string;
  lastUsed: string;
}

export interface ComparisonSide {
  label: string;
  dateLabel: string;
  quote: string;
  stats: { label: string; value: string }[];
}

export interface TimelineNode {
  horizon: string;
  year: string;
  title: string;
  seed: number;
  isNow: boolean;
}

export interface BackcastStep {
  horizon: string;
  year: string;
  goal: string;
  items: string[];
  primary: boolean;
}
