import { PencilLine } from "lucide-react";
import { Button, Card } from "@selfsketch/ui";

export function QuickSketchCard({ logged }: { logged: boolean }) {
  return (
    <Card
      tone="surface"
      className="flex w-full flex-col items-start gap-4 p-4 sm:flex-row sm:items-center"
    >
      <div className="grid h-20 w-full shrink-0 place-items-center rounded-[10px] bg-track sm:h-full sm:min-h-20 sm:w-26">
        <PencilLine size={22} className="text-brown" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <p className="text-[15px] font-bold text-ink">
          {logged ? "今日のスケッチは記録済み" : "今日のスケッチはまだ"}
        </p>
        <p className="text-xs leading-relaxed text-brown">
          5分だけ。ドラッグ＆ドロップで写真をアップロード、またはWebキャンバスで直接描けます。
        </p>
      </div>

      <Button size="md" className="h-[38px] px-[18px]">
        記録する
      </Button>
    </Card>
  );
}
