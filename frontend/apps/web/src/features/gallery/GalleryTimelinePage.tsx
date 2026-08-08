import { useNavigate } from "react-router";
import { Upload } from "lucide-react";
import { Button, PageHeader, Segmented, Thumb } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { useGalleryMonths } from "@/lib/api/gallery";

const VIEWS = ["タイムライン", "グリッド"] as const;

export function GalleryTimelinePage() {
  usePageMeta("メイン", "ギャラリー");
  const navigate = useNavigate();
  const months = useGalleryMonths();

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
        {months.map((m) => (
          <section key={m.label} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[15px] font-bold text-ink">{m.label}</h3>
              <span className="text-[11px] font-medium text-muted">
                {m.summary}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {m.items.map((item) => (
                <li key={item.id}>
                  <Thumb
                    seed={item.seed}
                    className="flex h-37 items-end p-2.5 transition-transform hover:scale-[1.02]"
                  >
                    <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold text-paper">
                      {item.dateLabel}
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
