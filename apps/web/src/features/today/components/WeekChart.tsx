import { Card, CardLabel, cn } from "@selfsketch/ui";

const DAYS = ["月", "火", "水", "木", "金", "土", "日"];
const MAX_BAR = 84;

export function WeekChart({ values }: { values: number[] }) {
  return (
    <Card tone="paper" className="flex flex-col gap-3 p-4">
      <CardLabel>今週の達成率</CardLabel>
      <ul className="flex h-[104px] items-end justify-between gap-2.5">
        {values.map((v, i) => (
          <li
            key={DAYS[i]}
            className="flex flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span
              title={`${DAYS[i]}曜日 ${Math.round(v * 100)}%`}
              className={cn(
                "w-full rounded-[5px]",
                v >= 1 ? "bg-ink" : v > 0 ? "bg-brown" : "bg-track",
              )}
              style={{ height: Math.max(5, Math.round(v * MAX_BAR)) }}
            />
            <span className="text-[9px] text-muted">{DAYS[i]}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
