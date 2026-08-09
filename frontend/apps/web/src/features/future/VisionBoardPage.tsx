import { useState } from "react";
import { useNavigate } from "react-router";
import { Moon, Sparkles } from "lucide-react";
import {
  Button,
  Card,
  CardLabel,
  MeterRow,
  PageHeader,
  Progress,
  Segmented,
  Skeleton,
  SkeletonGroup,
  cn,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useVision } from "@/usecase/future";
import type { Horizon } from "@/domain/model/vision";
import {
  HORIZONS,
  HORIZON_LABEL,
  milestoneMonthLabel,
  visionTargetLabel,
} from "@/presentation/format/vision";

export function VisionBoardPage() {
  usePageMeta("メイン", "未来の自分");
  const navigate = useNavigate();
  const { vision, isLoading } = useVision();
  const [horizon, setHorizon] = useState<Horizon>("1_year");

  if (isLoading || !vision) {
    return <VisionSkeleton label="ビジョンボードを読み込み中" />;
  }

  return (
    <>
      <PageHeader
        title="未来の自分"
        actions={
          <>
            <Segmented
              options={HORIZONS.map((h) => HORIZON_LABEL[h])}
              value={HORIZON_LABEL[horizon]}
              onChange={(label) =>
                setHorizon(
                  HORIZONS.find((h) => HORIZON_LABEL[h] === label) ?? horizon,
                )
              }
            />
            <Button variant="outline" icon={<Sparkles size={15} />}>
              AIで描き直す
            </Button>
          </>
        }
      />

      {/* ---- ヒーロー ---- */}
      <Card tone="ink" className="flex flex-col gap-6 p-6 lg:flex-row">
        <div className="grid h-52 w-full shrink-0 place-items-center rounded-[14px] bg-nav-active lg:h-auto lg:w-[300px]">
          <Moon size={30} className="text-nav-icon" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <span className="text-[11px] font-bold tracking-[2px] text-nav-icon">
            {HORIZON_LABEL[vision.horizon].toUpperCase()} FROM NOW ·{" "}
            {visionTargetLabel(vision.targetDate)}
          </span>
          <p className="text-[26px] leading-[1.7] font-bold text-paper">
            {vision.quote}
          </p>
          <p className="text-sm leading-[1.9] text-nav-fg">{vision.body}</p>

          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <span className="text-xs font-semibold text-nav-fg">
                この未来への近づき方
              </span>
              <span className="h-px flex-1" />
              <span className="text-xl leading-none font-bold text-paper">
                {Math.round(vision.progress * 100)}%
              </span>
            </div>
            <Progress value={vision.progress} height={8} inverse />
          </div>

          <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
            <Button
              variant="inverse"
              onClick={() => navigate(`/future/${vision.id}`)}
            >
              この未来を詳しく見る
            </Button>
            <Button
              variant="ghost"
              className="border border-nav-label text-line hover:bg-nav-active"
            >
              未来を書き換える
            </Button>
          </div>
        </div>
      </Card>

      {/* ---- 下段 3カード ---- */}
      <div className="flex flex-1 flex-col gap-3.5 lg:flex-row">
        <Card className="flex flex-1 flex-col gap-2.5 p-4.5">
          <CardLabel>マイルストーン</CardLabel>
          {vision.milestones.map((m) => (
            <div key={m.title} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  m.reached ? "bg-ink" : "bg-line-strong",
                )}
              />
              <span className="w-8 shrink-0 text-[11px] font-bold text-muted">
                {milestoneMonthLabel(m.date)}
              </span>
              <span
                className={cn(
                  "text-xs",
                  m.reached ? "font-bold text-ink" : "font-medium text-brown",
                )}
              >
                {m.title}
              </span>
            </div>
          ))}
        </Card>

        <Card tone="surface" className="flex flex-1 flex-col gap-3 p-4.5">
          <CardLabel>この未来を支える習慣</CardLabel>
          {vision.habits.map((h) => (
            <MeterRow
              key={h.title}
              label={h.title}
              value={h.rate}
              labelWidth={110}
            />
          ))}
        </Card>

        <Card
          tone="outline"
          className="flex flex-1 flex-col gap-2.5 p-4.5"
        >
          <CardLabel>未来の自分からの手紙</CardLabel>
          <p className="text-[13px] leading-[2] font-semibold text-ink">
            {vision.letter}
          </p>
          <Button block className="mt-auto h-[38px]">
            新しい手紙を受け取る
          </Button>
        </Card>
      </div>
    </>
  );
}

function VisionSkeleton({ label }: { label: string }) {
  return (
    <SkeletonGroup label={label} className="flex-1 gap-3.5">
      <Skeleton className="h-9 w-48" />
      <div className="flex flex-1 flex-col gap-3.5 xl:flex-row">
        <Skeleton className="min-h-72 flex-1" />
        <Skeleton className="h-72 w-full xl:w-[320px]" />
      </div>
    </SkeletonGroup>
  );
}
