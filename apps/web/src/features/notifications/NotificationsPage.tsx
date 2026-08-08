import { useState } from "react";
import {
  Bell,
  Flame,
  Heart,
  Moon,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardLabel,
  Chip,
  PageHeader,
  Switch,
  cn,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_FILTERS,
  useNotifications,
} from "@/lib/api/notifications";

const ICONS: Record<string, LucideIcon> = {
  bell: Bell,
  flame: Flame,
  heart: Heart,
  sparkles: Sparkles,
  users: Users,
  moon: Moon,
};

export function NotificationsPage() {
  usePageMeta("その他", "通知");
  const groups = useNotifications();
  const [filter, setFilter] = useState<string>(NOTIFICATION_FILTERS[0]);
  const [channels, setChannels] = useState(NOTIFICATION_CHANNELS);

  const unread = groups
    .flatMap((g) => g.items)
    .filter((i) => i.unread).length;

  return (
    <>
      <PageHeader
        title="通知"
        badge={<Badge tone="solid">未読 {unread}</Badge>}
        actions={
          <>
            <div className="flex flex-wrap gap-1.5">
              {NOTIFICATION_FILTERS.map((f) => (
                <Chip key={f} active={f === filter} onClick={() => setFilter(f)}>
                  {f}
                </Chip>
              ))}
            </div>
            <Button variant="outline">すべて既読にする</Button>
          </>
        }
      />

      <div className="flex w-full flex-1 flex-col gap-4.5 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {groups.map((g) => (
            <section key={g.label} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-[1.3px] text-muted">
                  {g.label}
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>

              {g.items.map((n) => {
                const Icon = ICONS[n.icon] ?? Bell;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3.5",
                      n.unread
                        ? "border border-line-strong bg-surface"
                        : "border border-line bg-paper",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-[10px]",
                        n.unread ? "bg-ink text-paper" : "bg-track text-brown",
                      )}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={cn(
                          "text-[13px] text-ink",
                          n.unread ? "font-bold" : "font-medium",
                        )}
                      >
                        {n.title}
                      </span>
                      <span className="text-[11px] text-muted">
                        {n.category} · {n.time}
                      </span>
                    </span>
                    {n.unread && (
                      <span className="size-2 shrink-0 rounded-full bg-ink" />
                    )}
                  </div>
                );
              })}
            </section>
          ))}
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
