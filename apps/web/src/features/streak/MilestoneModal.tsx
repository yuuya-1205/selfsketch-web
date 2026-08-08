import { useNavigate } from "react-router";
import { Share2 } from "lucide-react";
import { Button, Card, Modal } from "@selfsketch/ui";

const STATS = [
  { label: "連続", value: "14日" },
  { label: "達成率", value: "92%" },
  { label: "累計", value: "148回" },
];

export function MilestoneModal() {
  const navigate = useNavigate();
  const close = () => navigate("/streak");

  return (
    <Modal onClose={close} bare width={480}>
      <div className="flex flex-col items-center gap-4.5 p-9">
        <div className="flex size-26 flex-col items-center justify-center gap-0.5 rounded-full bg-ink">
          <span className="text-[26px] leading-none font-bold text-line">●</span>
          <span className="text-[22px] leading-none font-bold text-paper">
            14
          </span>
        </div>

        <h2 className="text-[26px] font-bold text-ink">14日連続、達成。</h2>
        <p className="text-center text-[13px] leading-[1.9] text-brown">
          「二週の人」バッジを獲得しました。2週間前のあなたが決めたことを、今日のあなたが続けています。
        </p>

        <div className="flex w-full gap-2.5">
          {STATS.map((s) => (
            <Card
              key={s.label}
              tone="surface"
              className="flex flex-1 flex-col items-center gap-0.5 border-0 px-2.5 py-3"
            >
              <span className="text-[10px] font-semibold tracking-[1px] text-muted">
                {s.label}
              </span>
              <span className="text-base font-bold text-ink">{s.value}</span>
            </Card>
          ))}
        </div>

        <Button size="lg" block icon={<Share2 size={16} />}>
          この達成をシェアする
        </Button>
        <button
          type="button"
          onClick={close}
          className="text-xs font-semibold text-muted hover:text-ink"
        >
          閉じて続ける
        </button>
      </div>
    </Modal>
  );
}
