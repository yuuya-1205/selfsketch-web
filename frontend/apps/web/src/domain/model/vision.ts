/** 未来の自分を描く時間軸 */
export type Horizon = "6_months" | "1_year" | "3_years" | "10_years";

export interface VisionMilestone {
  /** 到達を狙う月 */
  date: Date;
  title: string;
  reached: boolean;
}

export interface VisionStep {
  /** いまから何か月後か。0 は「いま」 */
  offsetMonths: number;
  title: string;
  reached: boolean;
}

export interface VisionHabit {
  title: string;
  /** 0–1 */
  rate: number;
}

export interface Vision {
  id: string;
  horizon: Horizon;
  /** 到達予定日 */
  targetDate: Date;
  /** かぎ括弧を含む引用文 */
  quote: string;
  body: string;
  /** 0–1 */
  progress: number;
  milestones: VisionMilestone[];
  habits: VisionHabit[];
  letter: string;
  story: string[];
  steps: VisionStep[];
}
