/** `GET /api/v1/visions/{id}` のレスポンス型 */
export type HorizonDto = "6_months" | "1_year" | "3_years" | "10_years";

export interface VisionDto {
  id: string;
  horizon: HorizonDto;
  /** RFC 3339 / UTC */
  targetDate: string;
  quote: string;
  body: string;
  progress: number;
  /** milestones[].date は RFC 3339 / UTC */
  milestones: { date: string; title: string; reached: boolean }[];
  habits: { title: string; rate: number }[];
  letter: string;
  story: string[];
  /** offsetMonths は「いまから何か月後か」。0 は「いま」 */
  steps: { offsetMonths: number; title: string; reached: boolean }[];
}
