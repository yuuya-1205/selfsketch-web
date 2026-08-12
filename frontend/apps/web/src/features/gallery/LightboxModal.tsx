import { useNavigate, useParams } from "react-router";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { Button, Modal, Thumb } from "@selfsketch/ui";
import { useGalleryItem } from "@/usecase/gallery";
import { galleryDayLabel } from "@/presentation/format/gallery";

const META = [
  { key: "習慣", value: "5分スケッチ" },
  { key: "制作時間", value: "15分" },
  { key: "連続", value: "14日目" },
];

export function LightboxModal() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  // グリッド画面の上に乗るので、同じキャッシュから該当作品だけ取り出す
  const item = useGalleryItem(itemId);
  const close = () => navigate("/gallery/grid");

  if (!item) return null;

  return (
    <Modal
      onClose={close}
      bare
      width={1000}
      className="h-[640px] max-h-[85vh]"
    >
      <div className="flex h-full flex-col md:flex-row">
        <Thumb
          src={item.imageUrl}
          alt={item.title}
          seed={item.seed}
          className="min-h-60 flex-1 rounded-none border-0"
        />

        <aside className="flex w-full shrink-0 flex-col gap-3.5 border-l border-line bg-paper p-5.5 md:w-[300px]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-[1.1px] text-muted">
              {item.createdAt.getFullYear()}年{galleryDayLabel(item.createdAt)}
            </span>
            <span className="h-px flex-1" />
            <button type="button" aria-label="閉じる" onClick={close}>
              <X size={17} className="text-muted" />
            </button>
          </div>

          <h2 className="text-[19px] leading-[1.5] font-bold text-ink">
            {item.title}
          </h2>
          <p className="text-[13px] leading-[1.9] text-brown">
            手首から動かす感覚がわかった一枚。5分の予定が15分になった日。
          </p>

          <dl className="flex flex-col gap-2 rounded-xl bg-surface p-3.5">
            {META.map((m) => (
              <div key={m.key} className="flex items-center gap-2">
                <dt className="text-[11px] text-muted">{m.key}</dt>
                <span className="h-px flex-1" />
                <dd className="text-xs font-bold text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto flex flex-col gap-2">
            <div className="flex gap-2">
              <Button variant="outline" block icon={<ChevronLeft size={14} />}>
                前の作品
              </Button>
              <Button variant="outline" block icon={<ChevronRight size={14} />}>
                次の作品
              </Button>
            </div>
            <Button block icon={<Download size={15} />}>
              高解像度でダウンロード
            </Button>
          </div>
        </aside>
      </div>
    </Modal>
  );
}
