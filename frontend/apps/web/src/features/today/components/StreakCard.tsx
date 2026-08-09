import { Flame } from "lucide-react";
import { Card, cn } from "@selfsketch/ui";
import type { StreakSummary } from "@/domain/model/today";

const FROM_MONDAY = ["月", "火", "水", "木", "金", "土", "日"];
const FROM_SUNDAY = ["日", "月", "火", "水", "木", "金", "土"];

export function StreakCard({ streak }: { streak: StreakSummary }) {
  const toBest = Math.max(streak.longest - streak.current, 0);
  const days = streak.weekStartsOn === "sunday" ? FROM_SUNDAY : FROM_MONDAY;

  return (
    <Card tone="ink" className="flex flex-col gap-3.5 p-[18px]">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold tracking-[1.4px] text-nav-icon">
          連続記録
        </span>
        <span className="h-px flex-1" />
        <Flame size={14} className="text-line" />
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-[38px] leading-none font-bold text-paper">
          {streak.current}
        </span>
        <span className="text-[13px] font-semibold text-nav-fg">日連続</span>
      </div>

      <ul className="flex w-full justify-between">
        {days.map((d, i) => (
          <li key={d} className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "size-[26px] rounded-full",
                streak.week[i] ? "bg-line" : "bg-nav-active",
              )}
            />
            <span className="text-[10px] text-nav-icon">{d}</span>
          </li>
        ))}
      </ul>

      <p className="text-[11px] text-nav-label">
        最長 {streak.longest}日
        {toBest > 0 && ` — あと ${toBest}日で自己ベスト`}
      </p>
    </Card>
  );
}
