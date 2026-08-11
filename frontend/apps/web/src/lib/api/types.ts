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
/* ---- 通知 ---------------------------------------------------------- */
/* ---- 設定 ---------------------------------------------------------- */

/** 公開範囲を選ぶ設定の選択肢。`.pen` W-Set 4 のセレクトと 1:1 */
export interface StorageMeter {
  label: string;
  used: string;
  ratio: number;
}

export interface FaqItem {
  question: string;
  answer: string;
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
