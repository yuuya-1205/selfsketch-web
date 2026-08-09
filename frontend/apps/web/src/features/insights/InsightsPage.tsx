import { useNavigate } from "react-router";
import {
  Calendar,
  ChevronDown,
  Download,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Button,
  Card,
  MeterRow,
  PageHeader,
  Skeleton,
  SkeletonGroup,
  cn,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useInsightsQuery } from "@/lib/api/insights";

export function InsightsPage() {
  usePageMeta("分析・つながり", "インサイト");
  const navigate = useNavigate();
  const { data, isLoading } = useInsightsQuery();

  if (isLoading || !data) {
    return <InsightsSkeleton />;
  }

  const maxDays = Math.max(...data.monthlyRecordDays);
  const maxHour = Math.max(...data.hourly);

  return (
    <>
      <PageHeader
        title="インサイト"
        actions={
          <>
            <button
              type="button"
              className="flex h-9.5 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3.5"
            >
              <Calendar size={14} className="text-brown" />
              <span className="text-xs font-semibold text-ink">2026年 4月</span>
              <ChevronDown size={14} className="text-muted" />
            </button>
            <Button
              icon={<Download size={14} />}
              onClick={() => navigate("/insights/monthly")}
            >
              CSV / PDF 出力
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {data.kpis.map((k) => (
          <Card key={k.label} className="flex flex-col gap-1 p-4">
            <span className="text-[11px] font-bold tracking-[1.1px] text-muted">
              {k.label}
            </span>
            <span className="flex items-end gap-1">
              <span className="text-[28px] leading-none font-bold text-ink">
                {k.value}
              </span>
              <span className="text-xs font-semibold text-brown">{k.unit}</span>
            </span>
            <span
              className={cn(
                "flex items-center gap-1 text-[11px] font-semibold",
                k.up ? "text-brown" : "text-muted",
              )}
            >
              {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {k.delta}
            </span>
          </Card>
        ))}
      </div>

      <div className="flex w-full flex-1 flex-col gap-3.5 xl:flex-row">
        <Card className="flex min-h-70 flex-1 flex-col gap-3.5 p-4.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-ink">月ごとの記録日数</h3>
            <span className="h-px flex-1" />
            <span className="text-[11px] font-medium text-muted">
              直近 12か月
            </span>
          </div>
          <BarChart
            values={data.monthlyRecordDays.map((v) => v / maxDays)}
            valueLabels={data.monthlyRecordDays.map(String)}
            labels={data.monthLabels}
            highlight={data.monthlyRecordDays.length - 1}
            height={200}
          />
        </Card>

        <div className="flex w-full shrink-0 flex-col gap-3 xl:w-[380px]">
          <Card tone="surface" className="flex flex-col gap-3 p-4.5">
            <h3 className="text-xs font-bold text-ink">習慣ごとの達成率</h3>
            {data.habitRates.map((h) => (
              <MeterRow key={h.title} label={h.title} value={h.rate} />
            ))}
          </Card>

          <Card className="flex flex-1 flex-col gap-3 p-4.5">
            <h3 className="text-xs font-bold text-ink">記録した時間帯</h3>
            <ul className="flex flex-1 items-end justify-between gap-[3px]">
              {data.hourly.map((v, i) => (
                <li
                  key={i}
                  className="flex flex-1 flex-col items-center justify-end gap-1"
                >
                  <span
                    title={`${i}時 · ${v}件`}
                    className={cn(
                      "w-full rounded-[3px]",
                      v >= 10 ? "bg-ink" : v >= 4 ? "bg-brown" : "bg-line-strong",
                    )}
                    style={{ height: Math.max(3, (v / maxHour) * 100) }}
                  />
                  {i % 6 === 0 && (
                    <span className="text-[8px] text-muted">{i}</span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function InsightsSkeleton() {
  return (
    <SkeletonGroup label="インサイトを読み込み中" className="flex-1 gap-3.5">
      <Skeleton className="h-9 w-52" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
      <div className="flex flex-col gap-3.5 xl:flex-row">
        <Skeleton className="h-52 flex-1" />
        <Skeleton className="h-52 flex-1" />
      </div>
    </SkeletonGroup>
  );
}
