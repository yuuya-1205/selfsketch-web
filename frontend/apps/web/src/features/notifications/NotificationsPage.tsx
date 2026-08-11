import { useState } from "react";
import { BellOff } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardLabel,
  Chip,
  EmptyState,
  PageHeader,
  Switch,
  cn,
  Skeleton,
  SkeletonGroup,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import {
  useMarkAllNotificationsRead,
  useNotifications,
  type NotificationFilter,
} from "@/usecase/notifications";
import { QueryErrorView } from "@/presentation/components/QueryBoundary";
import {
  BUCKET_LABEL,
  CATEGORY_ICON,
  CATEGORY_LABEL,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_FILTERS,
} from "@/presentation/constants/notifications";
import { notificationTimeLabel } from "@/presentation/format/notification";

export function NotificationsPage() {
  usePageMeta("その他", "通知");

  const [filter, setFilter] = useState<NotificationFilter>(null);
  const { groups, unreadCount, isLoading, error, retry } =
    useNotifications(filter);
  const markAllRead = useMarkAllNotificationsRead();
  const [channels, setChannels] = useState(NOTIFICATION_CHANNELS);

  if (error) return <QueryErrorView error={error} onRetry={retry} />;

  if (isLoading || !groups) {
    return <NotificationsSkeleton />;
  }

  const now = new Date();

  return (
    <>
      <PageHeader
        title="通知"
        badge={<Badge tone="solid">未読 {unreadCount}</Badge>}
        actions={
          <>
            <div className="flex flex-wrap gap-1.5">
              {NOTIFICATION_FILTERS.map((f) => (
                <Chip
                  key={f.label}
                  active={f.value === filter}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </Chip>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => void markAllRead()}
              disabled={unreadCount === 0}
            >
              すべて既読にする
            </Button>
          </>
        }
      />

      <div className="flex w-full flex-1 flex-col gap-4.5 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {groups.length === 0 ? (
            <EmptyState
              icon={<BellOff size={20} />}
              title="この条件では見つかりません"
              body="絞り込みを外すと、ほかのお知らせが見つかるかもしれません。"
              actions={
                filter && (
                  <Button size="sm" onClick={() => setFilter(null)}>
                    絞り込みを解除
                  </Button>
                )
              }
            />
          ) : (
            groups.map((g) => (
              <section key={g.bucket} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-[1.3px] text-muted">
                    {BUCKET_LABEL[g.bucket]}
                  </span>
                  <span className="h-px flex-1 bg-line" />
                </div>

                {g.items.map((n) => {
                  const Icon = CATEGORY_ICON[n.category];
                  const unread = !n.read;
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3.5",
                        unread
                          ? "border border-line-strong bg-surface"
                          : "border border-line bg-paper",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-[10px]",
                          unread ? "bg-ink text-paper" : "bg-track text-brown",
                        )}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span
                          className={cn(
                            "text-[13px] text-ink",
                            unread ? "font-bold" : "font-medium",
                          )}
                        >
                          {n.title}
                        </span>
                        <span className="text-[11px] text-muted">
                          {CATEGORY_LABEL[n.category]} ·{" "}
                          {notificationTimeLabel(n.receivedAt, now)}
                        </span>
                      </span>
                      {unread && (
                        <span className="size-2 shrink-0 rounded-full bg-ink" />
                      )}
                    </div>
                  );
                })}
              </section>
            ))
          )}
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[320px]">
          <Card className="flex flex-col gap-3 p-4.5">
            <CardLabel>通知チャネル</CardLabel>
            {channels.map((c, i) => (
              <div key={c.label} className="flex items-center gap-2.5">
                <span className="flex-1 text-xs font-medium text-ink">
                  {c.label}
                </span>
                <Switch
                  label={c.label}
                  checked={c.enabled}
                  onChange={(v) =>
                    setChannels((prev) =>
                      prev.map((p, pi) => (pi === i ? { ...p, enabled: v } : p)),
                    )
                  }
                />
              </div>
            ))}
          </Card>

          <Card tone="surface" className="flex flex-1 flex-col gap-2.5 p-4.5">
            <CardLabel>通知しない時間帯</CardLabel>
            <div className="flex items-center gap-2.5">
              {["22:00", "07:00"].map((t, i) => (
                <span key={t} className="contents">
                  <span className="grid h-10 flex-1 place-items-center rounded-[10px] border border-line-strong bg-paper text-sm font-bold text-ink">
                    {t}
                  </span>
                  {i === 0 && (
                    <span className="text-[13px] font-semibold text-muted">
                      —
                    </span>
                  )}
                </span>
              ))}
            </div>
            <p className="text-[11px] leading-[1.8] text-brown">
              この時間帯はブラウザ通知もミュートされます。翌朝まとめて表示します。
            </p>
            <Button block className="mt-auto h-10">
              通知設定をひらく
            </Button>
          </Card>
        </aside>
      </div>
    </>
  );
}

function NotificationsSkeleton() {
  return (
    <SkeletonGroup label="通知を読み込み中" className="flex-1 gap-4">
      <Skeleton className="h-9 w-32" />
      <div className="flex flex-1 flex-col gap-4 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full xl:w-[320px]" />
      </div>
    </SkeletonGroup>
  );
}
