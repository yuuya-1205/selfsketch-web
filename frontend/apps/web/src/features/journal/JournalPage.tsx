import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Ellipsis, Image as ImageIcon, PenLine, Star } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardLabel,
  Chip,
  EmptyState,
  IconButton,
  PageHeader,
  Skeleton,
  SkeletonGroup,
  Thumb,
  cn,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { JOURNAL_FILTERS } from "@/presentation/constants/journalFilters";
import { useJournal } from "@/usecase/journal";
import {
  MOOD_COLOR,
  MOOD_LABEL,
  journalDateLabel,
  journalStatLabels,
  journalTimestampLabel,
} from "@/presentation/format/journal";
import { QueryErrorView } from "@/presentation/components/QueryBoundary";

export function JournalPage() {
  usePageMeta("メイン", "ジャーナル");
  const navigate = useNavigate();
  const { entryId } = useParams();
  const { entries, entry, isLoading, error, retry } = useJournal(entryId);
  const [filter, setFilter] = useState<string>(JOURNAL_FILTERS[0]);

  if (error) return <QueryErrorView error={error} onRetry={retry} />;

  if (isLoading || !entries || !entry) {
    return <JournalSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="ジャーナル"
        badge={<Badge>{entries.length * 17} 件</Badge>}
        actions={
          <Button
            icon={<PenLine size={15} />}
            onClick={() => navigate("/journal/new")}
          >
            新しいエントリー
          </Button>
        }
      />

      <div className="flex w-full flex-1 flex-col gap-4.5 lg:flex-row">
        {/* ---- 一覧ペイン ---- */}
        <div className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[360px]">
          <div className="flex flex-wrap gap-1.5">
            {JOURNAL_FILTERS.map((f) => (
              <Chip
                key={f}
                active={f === filter}
                onClick={() => setFilter(f)}
              >
                {f}
              </Chip>
            ))}
          </div>

          {entries.length === 0 && (
            <EmptyState
              icon={<PenLine size={20} />}
              title="今日の最初の一筆を。"
              body="書いた言葉は、半年後の自分が読み返します。ひとことでも残ります。"
              actions={
                <Button size="sm" onClick={() => navigate("/journal/new")}>
                  書いてみる
                </Button>
              }
            />
          )}

          {entries.map((e) => {
            const active = e.id === entry.id;
            return (
              <Link
                key={e.id}
                to={`/journal/${e.id}`}
                className={cn(
                  "flex flex-col gap-1.5 rounded-xl px-3.5 py-3.5 transition-colors",
                  active
                    ? "border-[1.5px] border-ink bg-surface"
                    : "border border-line bg-paper hover:bg-surface",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: MOOD_COLOR[e.mood] }}
                  />
                  <span className="text-[11px] font-semibold text-muted">
                    {journalDateLabel(e.writtenAt)}
                  </span>
                  <span className="h-px flex-1" />
                  {e.hasImage && (
                    <ImageIcon size={12} className="text-line-strong" />
                  )}
                </span>
                <span className="text-sm font-bold text-ink">{e.title}</span>
                <span className="text-xs leading-[1.7] text-brown">
                  {e.excerpt}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ---- プレビューペイン ---- */}
        <Card
          tone="surface"
          className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl p-5 lg:p-6.5"
        >
          <div className="flex items-start gap-2.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-[11px] font-semibold tracking-[1px] text-muted">
                {journalTimestampLabel(entry.writtenAt)}
              </span>
              <h2 className="text-2xl font-bold text-ink">{entry.title}</h2>
            </div>
            <IconButton label="お気に入り" className="bg-paper">
              <Star size={15} className="text-brown" />
            </IconButton>
            <IconButton
              label="編集"
              className="bg-paper"
              onClick={() => navigate("/journal/new")}
            >
              <PenLine size={15} className="text-brown" />
            </IconButton>
            <IconButton label="その他" className="bg-paper">
              <Ellipsis size={15} className="text-brown" />
            </IconButton>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge tone="solid">{entry.habitTitle}</Badge>
            <Badge className="bg-paper">気分: {MOOD_LABEL[entry.mood]}</Badge>
            {entry.tags.map((t) => (
              <Badge key={t} className="bg-paper">
                #{t}
              </Badge>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-5 xl:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-3.5">
              {entry.body.map((p, i) => (
                <p key={i} className="text-sm leading-[2] text-ink">
                  {p}
                </p>
              ))}
              <blockquote className="rounded-xl border-l-[3px] border-line-strong bg-paper px-4.5 py-3.5 text-[13px] leading-[1.8] font-semibold text-brown">
                {entry.quote}
              </blockquote>
            </div>

            <aside className="flex w-full shrink-0 flex-col gap-2.5 xl:w-[220px]">
              <Thumb seed={3} className="h-55 w-full rounded-xl" />
              <span className="text-[11px] font-semibold text-muted">
                今日のスケッチ · 15分
              </span>
              <Card className="flex flex-col gap-2 p-3.5">
                <CardLabel>この日の記録</CardLabel>
                {journalStatLabels(entry.stats).map((s) => (
                  <span key={s} className="text-xs font-medium text-ink">
                    · {s}
                  </span>
                ))}
              </Card>
            </aside>
          </div>
        </Card>
      </div>
    </>
  );
}

function JournalSkeleton() {
  return (
    <SkeletonGroup label="ジャーナルを読み込み中" className="flex-1 gap-4.5">
      <Skeleton className="h-9 w-52" />
      <div className="flex flex-1 flex-col gap-4.5 lg:flex-row">
        <div className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[360px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="min-h-80 flex-1" />
      </div>
    </SkeletonGroup>
  );
}
