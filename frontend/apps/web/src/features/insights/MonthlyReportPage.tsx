import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";
import {
  Button,
  Card,
  CardLabel,
  PageHeader,
  Skeleton,
  SkeletonGroup,
  Thumb,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useMonthlyReport } from "@/usecase/insights";
import {
  KPI_LABEL,
  reportStatLabel,
  reportStatValue,
  reportTitle,
} from "@/presentation/format/insights";
import { galleryDayLabel } from "@/presentation/format/gallery";
import { QueryErrorView } from "@/presentation/components/QueryBoundary";

export function MonthlyReportPage() {
  usePageMeta("分析・つながり", "月次レポート");
  const navigate = useNavigate();
  const { report: r, isLoading, error, retry } = useMonthlyReport();

  if (error) return <QueryErrorView error={error} onRetry={retry} />;

  if (isLoading || !r) {
    return <MonthlyReportSkeleton />;
  }

  return (
    <>
      <PageHeader
        title={reportTitle(r.month)}
        description="毎月1日に自動生成されます · 前回: 3月レポート"
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/insights")}>
              前の月
            </Button>
            <Button variant="outline">PDFで保存</Button>
            <Button>フレンドに共有</Button>
          </>
        }
      />

      <Card tone="ink" className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-[11px] font-bold tracking-[2px] text-nav-icon">
            MONTHLY REVIEW
          </span>
          <p className="text-[22px] leading-[1.6] font-bold text-paper">
            {r.headline}
          </p>
          <p className="text-[13px] leading-[1.9] text-nav-fg">{r.summary}</p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          {r.stats.map((s) => (
            <div
              key={s.key}
              className="flex flex-col items-center gap-1 rounded-xl bg-nav-card px-4.5 py-3.5"
            >
              <span className="text-[10px] font-semibold tracking-[1px] text-nav-icon">
                {reportStatLabel(s)}
              </span>
              <span className="text-xl font-bold text-paper">{reportStatValue(s)}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex w-full flex-1 flex-col gap-4 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <h3 className="text-xs font-bold tracking-[1px] text-ink">
            今月のハイライト
          </h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {r.highlights.map((h) => (
              <li
                key={h.title}
                className="flex flex-col overflow-hidden rounded-[13px] border border-line-strong"
              >
                <Thumb seed={h.seed} className="h-30 rounded-none border-0" />
                <div className="flex flex-col gap-1 bg-paper p-3">
                  <span className="text-[10px] font-bold tracking-[1px] text-muted">
                    {galleryDayLabel(h.date)}
                  </span>
                  <span className="text-[13px] font-bold text-ink">
                    {h.title}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <Card tone="surface" className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-brown" />
              <h3 className="text-xs font-bold text-ink">
                AI が見つけた3つの気づき
              </h3>
            </div>
            {r.findings.map((f, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-[11px] font-bold text-line-strong">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-[13px] leading-[1.8] font-medium text-ink">
                  {f}
                </p>
              </div>
            ))}
          </Card>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[330px]">
          <Card tone="outline" className="flex flex-col gap-3 p-4.5">
            <CardLabel>5月の提案</CardLabel>
            {r.suggestions.map((s) => (
              <div
                key={s.title}
                className="flex flex-col gap-0.5 rounded-[11px] bg-surface p-3"
              >
                <span className="text-[13px] font-bold text-ink">
                  {s.title}
                </span>
                <span className="text-[11px] text-brown">{s.reason}</span>
              </div>
            ))}
          </Card>

          <Card className="flex flex-1 flex-col gap-3 p-4.5">
            <CardLabel>先月との比較</CardLabel>
            {r.comparison.map((c) => (
              <div key={c.key} className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-ink">
                  {KPI_LABEL[c.key]}
                </span>
                <span className="h-1.75 w-full overflow-hidden rounded-full bg-track">
                  <span
                    className="block h-full rounded-full bg-line-strong"
                    style={{ width: `${c.prev * 100}%` }}
                  />
                </span>
                <span className="h-1.75 w-full overflow-hidden rounded-full bg-track">
                  <span
                    className="block h-full rounded-full bg-ink"
                    style={{ width: `${c.current * 100}%` }}
                  />
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3">
              {[
                { label: "3月", cls: "bg-line-strong" },
                { label: "4月", cls: "bg-ink" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5">
                  <span className={`size-2.25 rounded-[3px] ${l.cls}`} />
                  <span className="text-[10px] font-semibold text-muted">
                    {l.label}
                  </span>
                </span>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}

function MonthlyReportSkeleton() {
  return (
    <SkeletonGroup label="月次レポートを読み込み中" className="flex-1 gap-3.5">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-56 w-full" />
    </SkeletonGroup>
  );
}
