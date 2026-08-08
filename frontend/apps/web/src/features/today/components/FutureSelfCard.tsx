import { Link } from "react-router";
import { ChevronRight, Moon } from "lucide-react";
import { Card } from "@selfsketch/ui";
import type { FutureSelfSummary } from "@/lib/api/types";

export function FutureSelfCard({ future }: { future: FutureSelfSummary }) {
  return (
    <Card tone="surface" className="p-0">
      <Link
        to="/future"
        className="flex items-center gap-3 p-3.5 transition-colors hover:bg-line/40"
      >
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-track">
          {future.thumbnailUrl ? (
            <img
              src={future.thumbnailUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <Moon size={20} className="text-brown" />
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[13px] font-bold text-ink">{future.title}</span>
          <span className="text-[11px] text-brown">
            あと {future.remainingDays}日 · 進捗{" "}
            {Math.round(future.progress * 100)}%
          </span>
        </span>

        <ChevronRight size={16} className="shrink-0 text-muted" />
      </Link>
    </Card>
  );
}
