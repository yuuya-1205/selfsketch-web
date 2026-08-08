import { Outlet, useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { Badge, Button, Progress, SectionHeading } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useTodayDashboard, useToggleHabit } from "@/lib/api/today";
import { HabitRow } from "./components/HabitRow";
import { QuickSketchCard } from "./components/QuickSketchCard";
import { StreakCard } from "./components/StreakCard";
import { FutureSelfCard } from "./components/FutureSelfCard";
import { MoodCard } from "./components/MoodCard";
import { WeekChart } from "./components/WeekChart";

export function TodayPage() {
  usePageMeta("メイン", "今日の自分");
  const navigate = useNavigate();

  const { data, isPending } = useTodayDashboard();
  const toggle = useToggleHabit();

  if (isPending || !data) {
    return <TodaySkeleton />;
  }

  const ratio = data.totalCount ? data.completedCount / data.totalCount : 0;

  return (
    <>
      {/* ---- ヘッダー ------------------------------------------------ */}
      <header className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[26px] leading-none font-bold text-ink">
              {data.dateLabel}
            </h2>
            <Badge>
              {data.completedCount} / {data.totalCount} 完了
            </Badge>
          </div>
          <Progress
            value={ratio}
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

          {data.habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              onToggle={(done) => toggle.mutate({ id: habit.id, done })}
            />
          ))}

          <QuickSketchCard logged={data.sketchLogged} />
        </section>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[330px]">
          <StreakCard streak={data.streak} />
          <FutureSelfCard future={data.future} />
          <MoodCard quote={data.todayQuote} />
          <WeekChart values={data.weekCompletion} />
        </aside>
      </div>

      {/* /today/new のときに習慣作成モーダルが乗る */}
      <Outlet />
    </>
  );
}

function TodaySkeleton() {
  return (
    <div className="flex w-full flex-1 animate-pulse flex-col gap-5 xl:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[62px] w-full rounded-row bg-surface" />
        ))}
      </div>
      <div className="h-40 w-full rounded-card bg-surface xl:w-[330px]" />
    </div>
  );
}
