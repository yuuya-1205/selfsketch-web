import { useNavigate } from "react-router";
import { Image as ImageIcon, Upload } from "lucide-react";
import {
  Button,
  EmptyState,
  PageHeader,
  Segmented,
  Skeleton,
  SkeletonGroup,
  Thumb,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useGalleryTimeline } from "@/usecase/gallery";
import {
  galleryDayLabel,
  galleryMonthLabel,
  gallerySummaryLabel,
} from "@/presentation/format/gallery";
import { QueryErrorView } from "@/presentation/components/QueryBoundary";

const VIEWS = ["タイムライン", "グリッド"] as const;

export function GalleryTimelinePage() {
  usePageMeta("メイン", "ギャラリー");
  const navigate = useNavigate();
  const { months, isLoading, error, retry } = useGalleryTimeline();

  if (error) return <QueryErrorView error={error} onRetry={retry} />;

  if (isLoading || !months) {
    return <GallerySkeleton label="タイムラインを読み込み中" />;
  }

  return (
    <>
      <PageHeader
        title="作品のタイムライン"
        actions={
          <>
            <Segmented
              options={VIEWS}
              value="タイムライン"
              onChange={(v) => v === "グリッド" && navigate("/gallery/grid")}
            />
            <Button icon={<Upload size={15} />}>アップロード</Button>
          </>
        }
      />

      <div className="flex flex-col gap-4.5">
        {months.length === 0 && (
          <EmptyState
            icon={<ImageIcon size={20} />}
            title="ここはまだ余白"
            body="描いた一枚を残すと、月ごとに並んでいきます。写真に撮るだけでも大丈夫。"
          />
        )}

        {months.map((m) => (
          <section
            key={m.month.toISOString()}
            className="flex flex-col gap-2.5"
          >
            <div className="flex items-center gap-2.5">
              <h3 className="text-[15px] font-bold text-ink">
                {galleryMonthLabel(m.month)}
              </h3>
              <span className="text-[11px] font-medium text-muted">
                {gallerySummaryLabel(m.count, m.note)}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {m.items.map((item) => (
                <li key={item.id}>
                  <Thumb
                    src={item.imageUrl}
                    alt={item.title}
                    seed={item.seed}
                    className="flex h-37 items-end p-2.5 transition-transform hover:scale-[1.02]"
                  >
                    <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold text-paper">
                      {galleryDayLabel(item.createdAt)}
                    </span>
                  </Thumb>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function GallerySkeleton({ label }: { label: string }) {
  return (
    <SkeletonGroup label={label} className="gap-4.5">
      <Skeleton className="h-9 w-60" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2.5">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="aspect-square w-full" />
            ))}
          </div>
        </div>
      ))}
    </SkeletonGroup>
  );
}
