import { useNavigate, useParams } from "react-router";
import { Sunrise, Timer, Moon } from "lucide-react";
import {
  BackLink,
  Badge,
  Button,
  Card,
  CardLabel,
  Heatmap,
  PageHeader,
  Skeleton,
  SkeletonGroup,
  StatCard,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useHabitDetail } from "@/usecase/habits";
import {
  scheduleLabel,
  shortDateLabel,
} from "@/presentation/format/today";
import { QueryErrorView } from "@/presentation/components/QueryBoundary";

export function HabitDetailPage() {
  usePageMeta("メイン / 今日", "習慣の詳細");
  const navigate = useNavigate();
  const { habitId } = useParams();
  const { habit, isLoading, error, retry, daysSinceStart } = useHabitDetail(
    habitId ?? "h1",
  );

  if (error) return <QueryErrorView error={error} onRetry={retry} />;

  if (isLoading || !habit) {
    return <HabitDetailSkeleton />;
  }

  const chips = [
    { icon: Sunrise, label: scheduleLabel(habit.slot, habit.scheduledTime) },
    { icon: Timer, label: `${habit.durationMinutes}分` },
    ...(habit.linkedVision
      ? [
          {
            icon: Moon,
            label: `${habit.linkedVision.title}に紐づけ済み`,
          },
        ]
      : []),
  ];

  return (
    <>
      <BackLink onClick={() => navigate("/today")}>今日にもどる</BackLink>

      <PageHeader
        title={habit.title}
        actions={
          <>
            <Button variant="outline">編集</Button>
            <Button>今日の記録をつける</Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {chips.map(({ icon: Icon, label }) => (
          <Badge key={label} className="gap-1.5">
            <Icon size={12} />
            {label}
          </Badge>
        ))}
      </div>

      <div className="flex w-full flex-1 flex-col gap-3.5 xl:flex-row">
        <div className="flex flex-1 flex-col gap-3.5">
          <Card className="flex flex-col gap-3.5 p-4.5">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold tracking-[0.6px] text-ink">
                継続カレンダー · 直近12週
              </h3>
              <span className="h-px flex-1" />
              <span className="text-[11px] font-semibold text-brown">
                達成率 {Math.round(habit.achievementRate * 100)}%
              </span>
            </div>
            <Heatmap weeks={habit.heatmap} cell={22} legend />
          </Card>

          <Card tone="surface" className="flex flex-1 flex-col gap-3 p-4.5">
            <h3 className="text-xs font-bold tracking-[0.6px] text-ink">
              最近の記録
            </h3>
            {habit.notes.map((n) => (
              <div
                key={n.date.toISOString()}
                className="flex items-center gap-3.5 rounded-[11px] border border-line bg-paper px-3.5 py-3"
              >
                <span className="shrink-0 text-[11px] font-bold text-muted">
                  {shortDateLabel(n.date)}
                </span>
                <span className="text-[13px] text-ink">{n.body}</span>
              </div>
            ))}
          </Card>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[300px]">
          <StatCard
            label="達成率"
            value={String(Math.round(habit.achievementRate * 100))}
            unit="%"
            caption="直近30日"
          />
          <StatCard
            label="現在の連続"
            value={String(habit.currentStreak)}
            unit="日"
            caption={`最長 ${habit.longestStreak}日`}
          />
          <StatCard
            label="累計"
            value={String(habit.totalCount)}
            unit="回"
            caption={`開始から ${daysSinceStart}日`}
          />

          <Card tone="surface" className="mt-auto flex flex-col gap-2.5 p-4">
            <CardLabel>この習慣の設定</CardLabel>
            <Button variant="outline" block>
              一時停止する
            </Button>
            <Button variant="danger" block>
              この習慣を削除
            </Button>
          </Card>
        </aside>
      </div>
    </>
  );
}

function HabitDetailSkeleton() {
  return (
    <SkeletonGroup label="習慣の詳細を読み込み中" className="flex-1 gap-3.5">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-7 w-64 rounded-full" />
      <div className="flex flex-1 flex-col gap-3.5 xl:flex-row">
        <div className="flex flex-1 flex-col gap-3.5">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-72 w-full xl:w-[300px]" />
      </div>
    </SkeletonGroup>
  );
}
