import { Link, Outlet, useNavigate } from "react-router";
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
import { useGalleryGrid } from "@/usecase/gallery";
import { QueryErrorView } from "@/presentation/components/QueryBoundary";

const VIEWS = ["タイムライン", "グリッド"] as const;

export function GalleryGridPage() {
  usePageMeta("メイン", "ギャラリー");
  const navigate = useNavigate();
  const { items, isLoading, error, retry } = useGalleryGrid();

  if (error) return <QueryErrorView error={error} onRetry={retry} />;

  if (isLoading || !items) {
    return <GalleryGridSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="すべての作品"
        actions={
          <>
            <Segmented
              options={VIEWS}
              value="グリッド"
              onChange={(v) => v === "タイムライン" && navigate("/gallery")}
            />
            <Button icon={<Upload size={15} />}>アップロード</Button>
          </>
        }
      />

      {items.length === 0 && (
        <EmptyState
          icon={<ImageIcon size={20} />}
          title="ここはまだ余白"
          body="描いた一枚を残すと、ここに並んでいきます。写真に撮るだけでも大丈夫。"
          actions={<Button size="sm">作品をアップロード</Button>}
        />
      )}

      <ul className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/gallery/grid/${item.id}`}>
              <Thumb
                src={item.imageUrl}
                alt={item.title}
                seed={item.seed}
                className="h-32 transition-transform hover:scale-[1.02]"
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* /gallery/grid/:itemId でライトボックスが乗る */}
      <Outlet />
    </>
  );
}

function GalleryGridSkeleton() {
  return (
    <SkeletonGroup label="作品一覧を読み込み中" className="gap-4.5">
      <Skeleton className="h-9 w-52" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </SkeletonGroup>
  );
}
