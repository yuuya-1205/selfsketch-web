import { Outlet, useNavigate } from "react-router";
import { Plus } from "lucide-react";
import {
  Badge,
  Button,
  Progress,
  SectionHeading,
  Skeleton,
  SkeletonGroup,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTodayDashboard, useToggleHabit } from "@/usecase/today";
import { dateLabel } from "@/presentation/format/today";
import { HabitRow } from "./components/HabitRow";
import { QuickSketchCard } from "./components/QuickSketchCard";
import { StreakCard } from "./components/StreakCard";
import { FutureSelfCard } from "./components/FutureSelfCard";
import { MoodCard } from "./components/MoodCard";
import { WeekChart } from "./components/WeekChart";

export function TodayPage() {
  usePageMeta("メイン", "今日の自分");
  const navigate = useNavigate();

  const { dashboard, isLoading, completedCount, totalCount, completionRate } =
    useTodayDashboard();
  const toggleHabit = useToggleHabit();

  if (isLoading || !dashboard) {
    return <TodaySkeleton />;
  }

  return (
    <>
      {/* ---- ヘッダー ------------------------------------------------ */}
      <header className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[26px] leading-none font-bold text-ink">
              {dateLabel(dashboard.date)}
            </h2>
            <Badge>
              {completedCount} / {totalCount} 完了
            </Badge>
          </div>
          <Progress
            value={completionRate}
            label="今日の達成率"
            className="max-w-[520px]"
          />
        </div>

        <Button
          icon={<Plus size={15} />}
          onClick={() => navigate("/today/new")}
        >
          習慣を追加
        </Button>
      </header>

      {/* ---- 本体：デスクトップ2カラム / タブレット以下1カラム ------- */}
      <div className="flex w-full flex-1 flex-col gap-5 xl:flex-row">
        {/* 1カラムのときは flex-1 を効かせない（縦に間延びするため） */}
        <section className="flex flex-col gap-3 xl:flex-1">
          <SectionHeading
            action={
              <button
                type="button"
                className="text-[11px] font-semibold text-muted hover:text-ink"
              >
                すべて表示
              </button>
            }
          >
            今日の習慣
          </SectionHeading>

          {dashboard.habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              onToggle={(done) => void toggleHabit(habit.id, done)}
            />
          ))}

          <QuickSketchCard logged={dashboard.sketchLogged} />
        </section>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[330px]">
          <StreakCard streak={dashboard.streak} />
          <FutureSelfCard future={dashboard.future} asOf={dashboard.date} />
          <MoodCard quote={dashboard.todayQuote} />
          <WeekChart values={dashboard.weekCompletion} />
        </aside>
      </div>

      {/* /today/new のときに習慣作成モーダルが乗る */}
      <Outlet />
    </>
  );
}

function TodaySkeleton() {
  return (
    <SkeletonGroup
      label="今日の習慣を読み込み中"
      className="flex-1 gap-5 xl:flex-row"
    >
      <div className="flex flex-1 flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[62px] w-full rounded-row" />
        ))}
      </div>
      <Skeleton className="h-40 w-full xl:w-[330px]" />
    </SkeletonGroup>
  );
}
