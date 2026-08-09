import { useState } from "react";
import { Outlet } from "react-router";
import {
  BarChart,
  Card,
  CardLabel,
  Heatmap,
  PageHeader,
  Progress,
  Segmented,
  Skeleton,
  SkeletonGroup,
  StatCard,
  cn,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useStreakQuery } from "@/lib/api/streak";

const RANGES = ["週", "月", "年"] as const;

export function StreakPage() {
  usePageMeta("分析・つながり", "軌跡");
  const { data: streak, isLoading } = useStreakQuery();
  const [range, setRange] = useState<(typeof RANGES)[number]>("年");

  if (isLoading || !streak) {
    return <StreakSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="続けてきた記録"
        actions={
          <Segmented options={RANGES} value={range} onChange={setRange} />
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="現在の連続"
          value={String(streak.current)}
          unit="日"
          caption="更新中"
        />
        <StatCard
          label="最長記録"
          value={String(streak.longest)}
          unit="日"
          caption="2月に達成"
        />
        <StatCard
          label="今月の達成率"
          value={String(Math.round(streak.monthlyRate * 100))}
          unit="%"
          caption="先月比 +9pt"
        />
        <StatCard
          label="累計記録"
          value={String(streak.totalRecords)}
          unit="回"
          caption={`${streak.totalDays}日間で`}
        />
      </div>

      <div className="flex w-full flex-1 flex-col gap-3.5 xl:flex-row">
        <div className="flex flex-1 flex-col gap-3.5">
          <Card className="flex flex-col gap-3 p-4.5">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-ink">2026年の記録</h3>
              <span className="h-px flex-1" />
              <span className="text-[11px] font-semibold text-brown">
                {streak.totalRecords} / {streak.totalDays} 日
              </span>
            </div>
            <div className="overflow-x-auto">
              <Heatmap weeks={streak.yearHeatmap} cell={14} />
            </div>
          </Card>

          <Card tone="surface" className="flex flex-1 flex-col gap-3 p-4.5">
            <h3 className="text-xs font-bold text-ink">
              週別の達成率 · 直近12週
            </h3>
            <BarChart
              values={streak.weeklyRates}
              labels={streak.weeklyRates.map((_, i) => `W${i + 1}`)}
              height={110}
              gap="gap-2.5"
              className="min-h-[130px]"
            />
          </Card>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[300px]">
          <Card tone="ink" className="flex flex-col gap-3 p-4.5">
            <span className="text-[11px] font-bold tracking-[1.3px] text-nav-icon">
              次のマイルストーン
            </span>
            <p className="text-[17px] leading-[1.5] font-bold text-paper">
              {streak.nextMilestone.label}まで あと{" "}
              {streak.nextMilestone.remaining}日
            </p>
            <Progress value={streak.nextMilestone.progress} height={8} inverse />
            <span className="text-[11px] text-nav-label">
              達成すると「二週の人」バッジを獲得
            </span>
          </Card>

          <Card className="flex flex-1 flex-col gap-3 p-4.5">
            <CardLabel>
              獲得バッジ {streak.badges.filter((b) => b.earned).length} /{" "}
              {streak.badges.length}
            </CardLabel>
            <ul className="grid grid-cols-3 gap-2.5">
              {streak.badges.map((b) => (
                <li
                  key={b.label}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-[11px] border px-1 py-3",
                    b.earned
                      ? "border-line-strong bg-surface"
                      : "border-line bg-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "text-xl font-bold",
                      b.earned ? "text-ink" : "text-line-strong",
                    )}
                  >
                    {b.glyph}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      b.earned ? "text-brown" : "text-muted",
                    )}
                  >
                    {b.label}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>

      {/* /streak/milestone のときに祝福モーダルが乗る */}
      <Outlet />
    </>
  );
}

function StreakSkeleton() {
  return (
    <SkeletonGroup label="軌跡を読み込み中" className="flex-1 gap-3.5">
      <Skeleton className="h-9 w-56" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-60 w-full" />
      <div className="flex flex-col gap-3.5 xl:flex-row">
        <Skeleton className="h-44 flex-1" />
        <Skeleton className="h-44 w-full xl:w-[320px]" />
      </div>
    </SkeletonGroup>
  );
}
