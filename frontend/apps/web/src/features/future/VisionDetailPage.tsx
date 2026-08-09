import { useNavigate, useParams } from "react-router";
import { Moon } from "lucide-react";
import {
  BackLink,
  Button,
  Card,
  CardLabel,
  PageHeader,
  Ring,
  Skeleton,
  SkeletonGroup,
  cn,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useVisionQuery } from "@/lib/api/future";

export function VisionDetailPage() {
  usePageMeta("メイン / 未来の自分", "1年後の自分");
  const navigate = useNavigate();
  const { visionId } = useParams();
  const { data: vision, isLoading } = useVisionQuery(visionId);

  if (isLoading || !vision) {
    return <VisionDetailSkeleton />;
  }

  return (
    <>
      <BackLink onClick={() => navigate("/future")}>
        ビジョンボードにもどる
      </BackLink>

      <PageHeader
        title="作品集をつくる自分"
        description={`${vision.dateLabel} · 残り ${vision.remainingDays}日 · 進捗 ${Math.round(vision.progress * 100)}%`}
        actions={
          <>
            <Button variant="outline">編集</Button>
            <Button variant="outline">共有</Button>
            <Button>この未来を軸にする</Button>
          </>
        }
      />

      <div className="flex w-full flex-1 flex-col gap-4.5 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <div className="grid h-70 w-full place-items-center rounded-2xl border border-line-strong bg-track">
            <Moon size={30} className="text-brown" />
          </div>

          <Card tone="surface" className="flex flex-1 flex-col gap-3 rounded-2xl p-5.5">
            <CardLabel>AI が描いたあなたの1年後</CardLabel>
            {vision.story.map((p, i) => (
              <p key={i} className="text-sm leading-[2.1] text-ink">
                {p}
              </p>
            ))}
          </Card>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[320px]">
          <Card tone="ink" className="flex flex-col items-center gap-3.5 p-4.5">
            <CardLabel className="self-start text-nav-icon">到達度</CardLabel>
            <Ring value={vision.progress} size={130}>
              <span className="text-[26px] leading-none font-bold text-paper">
                {Math.round(vision.progress * 100)}%
              </span>
              <span className="text-[10px] font-medium text-nav-icon">
                {vision.remainingDays}日 / 365日
              </span>
            </Ring>
          </Card>

          <Card className="flex flex-1 flex-col gap-3 p-4.5">
            <CardLabel>逆算プラン</CardLabel>
            <ol className="flex flex-col">
              {vision.steps.map((s, i) => (
                <li key={s.when} className="flex gap-3">
                  <div className="flex w-3.5 shrink-0 flex-col items-center">
                    <span
                      className={cn(
                        "size-2.75 rounded-full border-2 border-ink",
                        s.reached ? "bg-ink" : "bg-paper",
                      )}
                    />
                    {i < vision.steps.length - 1 && (
                      <span className="w-0.5 flex-1 bg-line" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 pb-3">
                    <span className="text-[10px] font-bold tracking-[1px] text-muted">
                      {s.when}
                    </span>
                    <span
                      className={cn(
                        "text-[13px]",
                        s.reached
                          ? "font-bold text-ink"
                          : "font-medium text-brown",
                      )}
                    >
                      {s.title}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>
    </>
  );
}

function VisionDetailSkeleton() {
  return (
    <SkeletonGroup label="ビジョンを読み込み中" className="flex-1 gap-3.5">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-9 w-64" />
      <div className="flex flex-1 flex-col gap-3.5 xl:flex-row">
        <Skeleton className="min-h-80 flex-1" />
        <Skeleton className="h-80 w-full xl:w-[320px]" />
      </div>
    </SkeletonGroup>
  );
}
