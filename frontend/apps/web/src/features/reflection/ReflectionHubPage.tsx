import { Link } from "react-router";
import {
  ArrowRight,
  GitCompare,
  Infinity as InfinityIcon,
  LayoutGrid,
  Milestone,
  PenLine,
  Route,
  Sunrise,
  type LucideIcon,
} from "lucide-react";
import {
  Button,
  Card,
  CardLabel,
  PageHeader,
  Skeleton,
  SkeletonGroup,
  cn,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useReflectionEntriesQuery } from "@/lib/api/reflection";

const ICONS: Record<string, LucideIcon> = {
  sunrise: Sunrise,
  "git-compare": GitCompare,
  milestone: Milestone,
  infinity: InfinityIcon,
  route: Route,
  "layout-grid": LayoutGrid,
};

const DAYS = ["月", "火", "水", "木", "金", "土", "日"];
const DONE = 4;

export function ReflectionHubPage() {
  usePageMeta("分析・つながり", "リフレクション");
  const { data: entries, isLoading } = useReflectionEntriesQuery();

  if (isLoading || !entries) {
    return <ReflectionHubSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="ふりかえる"
        description="過去を見て、未来を描き直す。時間軸を選んでください。"
        actions={
          <Button icon={<PenLine size={15} />}>
            <Link to="/reflection/daily">今日のリフレクション</Link>
          </Button>
        }
      />

      <Card
        tone="surface"
        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4"
      >
        <CardLabel>今週のふりかえり</CardLabel>
        <ul className="flex flex-1 gap-2">
          {DAYS.map((d, i) => (
            <li
              key={d}
              className={cn(
                "grid h-10 flex-1 place-items-center rounded-[9px] border text-xs font-semibold",
                i < DONE
                  ? "border-ink bg-ink text-paper"
                  : "border-line-strong bg-paper text-muted",
              )}
            >
              {d}
            </li>
          ))}
        </ul>
        <span className="text-[13px] font-bold text-ink">{DONE} / 7 日</span>
      </Card>

      <ul className="grid flex-1 grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map((e) => {
          const Icon = ICONS[e.icon] ?? Sunrise;
          return (
            <li key={e.to} className="flex">
              <Link to={e.to} className="flex flex-1">
                <Card className="flex flex-1 flex-col gap-2.5 p-5 transition-colors hover:bg-surface">
                  <span className="grid size-9.5 place-items-center rounded-[11px] bg-surface">
                    <Icon size={18} className="text-ink" />
                  </span>
                  <span className="text-base font-bold text-ink">
                    {e.title}
                  </span>
                  <span className="text-xs leading-[1.8] text-brown">
                    {e.description}
                  </span>
                  <span className="mt-auto flex items-center gap-2 pt-2">
                    <span className="text-[11px] font-medium text-muted">
                      最終: {e.lastUsed}
                    </span>
                    <span className="h-px flex-1" />
                    <ArrowRight size={15} className="text-ink" />
                  </span>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function ReflectionHubSkeleton() {
  return (
    <SkeletonGroup
      label="リフレクションを読み込み中"
      className="flex-1 gap-3.5"
    >
      <Skeleton className="h-9 w-48" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    </SkeletonGroup>
  );
}
