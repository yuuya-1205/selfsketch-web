import { Outlet, useNavigate } from "react-router";
import { Flame, Heart, Link2, MessageCircle, UserPlus } from "lucide-react";
import {
  Button,
  Card,
  CardLabel,
  PageHeader,
  SectionHeading,
  Thumb,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useFriendFeed, useFriends } from "@/lib/api/social";

export function FriendsPage() {
  usePageMeta("分析・つながり", "フレンド");
  const navigate = useNavigate();
  const feed = useFriendFeed();
  const friends = useFriends();

  return (
    <>
      <PageHeader
        title="フレンド"
        actions={
          <>
            <Button variant="outline" icon={<Link2 size={14} />}>
              招待リンクをコピー
            </Button>
            <Button
              icon={<UserPlus size={14} />}
              onClick={() => navigate("/friends/share")}
            >
              フレンドを招待
            </Button>
          </>
        }
      />

      <div className="flex w-full flex-1 flex-col gap-4.5 xl:flex-row">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <SectionHeading
            action={<span className="text-[11px] font-semibold text-muted">今日</span>}
          >
            フレンドのうごき
          </SectionHeading>

          {feed.map((f) => (
            <Card key={f.id} className="flex gap-3.5 border-line p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-line text-sm font-bold text-ink">
                {f.initial}
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink">{f.name}</span>
                  <span className="text-[11px] text-muted">{f.time}</span>
                </span>
                <span className="text-[13px] font-medium text-brown">
                  {f.action}
                </span>

                {f.extra && (
                  <div className="flex items-center gap-2.5 rounded-[11px] bg-surface px-3 py-2.5">
                    <Thumb seed={f.cheers} className="h-8.5 w-11 rounded-[7px]" />
                    <span className="text-xs font-semibold text-ink">
                      {f.extra}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3.5 pt-0.5">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-muted transition-colors hover:text-ink"
                  >
                    <Heart size={13} />
                    はげます {f.cheers}
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-muted transition-colors hover:text-ink"
                  >
                    <MessageCircle size={13} />
                    ひとこと
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[320px]">
          <Card tone="surface" className="flex flex-col gap-2.5 p-4.5">
            <CardLabel>フレンド {friends.length * 2} 人</CardLabel>
            {friends.map((f) => (
              <div key={f.name} className="flex items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-line text-xs font-bold text-ink">
                  {f.initial}
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="text-[13px] font-semibold text-ink">
                    {f.name}
                  </span>
                  <span className="text-[10px] text-muted">
                    {f.streakLabel}
                  </span>
                </span>
                <Flame size={14} className="text-line-strong" />
              </div>
            ))}
          </Card>

          <Card tone="ink" className="flex flex-1 flex-col justify-center gap-3 p-4.5">
            <p className="text-[17px] leading-[1.6] font-bold text-paper">
              ひとりで続けるより、
              <br />
              見られているほうが続く。
            </p>
            <p className="text-xs leading-[1.8] text-nav-fg">
              フレンドには「記録した／しない」だけが共有されます。内容は非公開のままです。
            </p>
            <Button
              variant="inverse"
              block
              onClick={() => navigate("/friends/share")}
            >
              リンクで招待する
            </Button>
          </Card>
        </aside>
      </div>

      {/* /friends/share でシェアモーダルが乗る */}
      <Outlet />
    </>
  );
}
