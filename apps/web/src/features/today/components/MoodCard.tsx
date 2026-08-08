import { MessageSquare } from "lucide-react";
import { Card, CardLabel } from "@selfsketch/ui";

export function MoodCard({ quote }: { quote: string }) {
  return (
    <Card tone="paper" className="flex flex-col gap-2.5 p-4">
      <CardLabel>今日のひとこと</CardLabel>
      <p className="text-sm leading-relaxed font-semibold text-ink">{quote}</p>
      <label className="flex h-9 items-center gap-2 rounded-[10px] border border-line bg-surface px-3">
        <MessageSquare size={14} className="shrink-0 text-muted" />
        <input
          type="text"
          placeholder="今の気分をひとことで…"
          className="w-full bg-transparent text-xs text-ink placeholder:text-muted focus:outline-none"
        />
      </label>
    </Card>
  );
}
