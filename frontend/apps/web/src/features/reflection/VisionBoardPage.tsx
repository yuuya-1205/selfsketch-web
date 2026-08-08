import { Button, Card, CardLabel, PageHeader, Thumb, cn } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { VISION_BOARD } from "@/lib/api/reflection";

export function ReflectionVisionBoardPage() {
  usePageMeta("分析・つながり", "ビジョンボード");
  const { words, quote, values } = VISION_BOARD;

  return (
    <>
      <PageHeader
        title="ビジョンボード"
        description="なりたい姿を1枚に。ドラッグで並べ替え、画像はドロップで追加できます（Web版）。"
        actions={
          <>
            <Button variant="outline">画像を追加</Button>
            <Button variant="outline">共有</Button>
            <Button>保存</Button>
          </>
        }
      />

      <div className="flex w-full flex-1 flex-col gap-3.5 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <Thumb
            seed={1}
            className="flex min-h-60 flex-1 items-end rounded-2xl p-4"
          >
            <span className="rounded-full bg-ink/80 px-3 py-1.5 text-[11px] font-semibold text-paper">
              迷いのない一本の線
            </span>
          </Thumb>

          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {words.map((w, i) => (
              <li
                key={w}
                className={cn(
                  "grid h-13 place-items-center rounded-xl border text-[13px] font-bold",
                  i === 0
                    ? "border-ink bg-ink text-paper"
                    : "border-line-strong bg-paper text-ink",
                )}
              >
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3.5 xl:w-[340px]">
          <Thumb seed={5} className="h-50 rounded-2xl" />
          <Card
            tone="ink"
            className="flex flex-1 flex-col justify-center gap-2.5 rounded-2xl p-5"
          >
            <CardLabel className="text-nav-icon">座右のことば</CardLabel>
            <p className="text-[17px] leading-[1.8] font-bold whitespace-pre-line text-paper">
              {quote}
            </p>
          </Card>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3.5 xl:w-[300px]">
          <Thumb seed={3} className="h-37 rounded-2xl" />
          <Card tone="surface" className="flex flex-1 flex-col gap-2.5 p-4.5">
            <CardLabel>大事にすること</CardLabel>
            {values.map((v) => (
              <span
                key={v}
                className="flex items-center gap-2 rounded-[10px] bg-paper px-3 py-2.5"
              >
                <span className="text-[10px] font-bold text-line-strong">
                  ◆
                </span>
                <span className="text-xs font-semibold text-ink">{v}</span>
              </span>
            ))}
          </Card>
          <Thumb seed={0} className="h-35 rounded-2xl" />
        </div>
      </div>
    </>
  );
}
