import { Button, Card, PageHeader, Thumb, cn } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { TIMELINE_NODES } from "@/presentation/constants/reflectionContent";

export function FutureTimelinePage() {
  usePageMeta("分析・つながり", "未来タイムライン");

  return (
    <>
      <PageHeader
        title="未来タイムライン"
        description="モバイルでは1つずつスワイプしていた未来を、Web版では横一列で見渡せます。"
        actions={<Button variant="outline">未来を編集</Button>}
      />

      {/* 横一列。狭い画面では横スクロールに逃がす */}
      <div className="flex flex-1 flex-col overflow-x-auto">
        <ul className="flex min-w-[820px] flex-1 items-end gap-3">
          {TIMELINE_NODES.map((n, index) => (
            <li key={n.horizon} className="flex flex-1 flex-col">
              <Card
                tone={n.isNow ? "ink" : "paper"}
                className={cn(
                  "flex flex-col gap-2.5 p-4",
                  n.isNow && "min-h-75",
                )}
              >
                {n.isNow ? (
                  <div className="min-h-32 flex-1 rounded-[10px] bg-nav-active" />
                ) : (
                  // 未来ほど小さく＝階段状に見せる
                  <Thumb
                    seed={n.seed}
                    className="rounded-[10px]"
                    style={{ height: 150 - index * 12 }}
                  />
                )}
                <span
                  className={cn(
                    "text-base font-bold",
                    n.isNow ? "text-paper" : "text-ink",
                  )}
                >
                  {n.horizon}
                </span>
                <span
                  className={cn(
                    "text-xs leading-[1.7] font-medium",
                    n.isNow ? "text-nav-fg" : "text-brown",
                  )}
                >
                  {n.title}
                </span>
              </Card>

              {/* 軸 */}
              <div className="flex h-8.5 items-center">
                <span className="h-0.5 flex-1 bg-line-strong" />
                <span
                  className={cn(
                    "rounded-full border-2 border-ink",
                    n.isNow ? "size-4 bg-ink" : "size-3 bg-paper",
                  )}
                />
                <span className="h-0.5 flex-1 bg-line-strong" />
              </div>

              <div className="flex flex-col items-center gap-0.5 pt-2">
                <span className="text-[11px] font-bold text-ink">{n.year}</span>
                <span className="text-[10px] font-medium text-muted">
                  {n.horizon}後
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
