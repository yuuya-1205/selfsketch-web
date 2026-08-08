import { useState } from "react";
import { EyeOff, HeartHandshake } from "lucide-react";
import { Button, Card, CardLabel, Chip, cn } from "@selfsketch/ui";
import { Pill } from "@/components/Table";
import {
  MODERATION_ACTIONS,
  MODERATION_FILTERS,
  REPORTS,
  REPORT_REASONS,
} from "@/lib/api/mock";

export function ModerationPage() {
  const [filter, setFilter] = useState(MODERATION_FILTERS.at(-1)!);
  const [current, setCurrent] = useState(REPORTS[0].id);
  const report = REPORTS.find((r) => r.id === current) ?? REPORTS[0];

  return (
    <>
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-[22px] leading-none font-bold text-ink">
            通報キュー
          </h1>
          <p className="text-[11px] font-medium text-muted">
            未処理 12件（緊急 2 / 通常 10）· 平均対応時間 3.4時間 · SLA 24時間
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {MODERATION_FILTERS.map((f) => (
            <Chip key={f} active={f === filter} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col gap-3.5 lg:flex-row">
        {/* ---- キュー ---- */}
        <div className="flex w-full shrink-0 flex-col gap-2.25 lg:w-[360px]">
          {REPORTS.map((r) => {
            const on = r.id === current;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setCurrent(r.id)}
                className={cn(
                  "flex flex-col gap-1.75 rounded-[11px] p-3.25 text-left transition-colors",
                  on
                    ? "border-[1.5px] border-ink bg-surface"
                    : "border border-line bg-paper hover:bg-surface",
                )}
              >
                <span className="flex items-center gap-1.75">
                  <Pill tone={r.tone === "danger" ? "danger" : "track"}>
                    {r.severity}
                  </Pill>
                  <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink">
                    {r.title}
                  </span>
                </span>
                <span className="truncate text-[11px] font-medium text-brown">
                  {r.target}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-muted">
                    {r.count}
                  </span>
                  <span className="h-px flex-1" />
                  <span className="text-[10px] text-muted">{r.time}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* ---- 詳細 ---- */}
        <Card className="flex min-w-0 flex-1 flex-col gap-3 p-4.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="truncate text-[17px] font-bold text-ink">
                {report.title} · {report.target.split(" · ")[0]}
              </h2>
              <p className="text-[11px] font-medium text-muted">
                投稿者: ゆい (user_20114) · 公開範囲: フレンド · {report.count} ·
                初回通報 {report.time}
              </p>
            </div>
            <Button variant="danger" size="sm">
              専門窓口にエスカレーション
            </Button>
          </div>

          <div className="flex flex-col gap-3.5 md:flex-row">
            {/* マスクされた対象 */}
            <div className="flex h-50 w-full shrink-0 flex-col items-center justify-center gap-2 rounded-[11px] border border-line-strong bg-[#ded2bd] md:w-70">
              <EyeOff size={22} className="text-brown" />
              <span className="text-[11px] font-bold text-brown">
                画像はマスク中
              </span>
              <Button size="sm">監査ログ付きで表示</Button>
            </div>

            <Card tone="surface" className="flex min-w-0 flex-1 flex-col gap-2.25 p-3.5">
              <CardLabel className="text-[10px]">通報の内訳</CardLabel>
              {REPORT_REASONS.map((r) => (
                <div key={r.label} className="flex items-center gap-2.25">
                  <span
                    className={cn(
                      "size-1.75 shrink-0 rounded-full",
                      r.tone === "danger" ? "bg-danger" : "bg-warn",
                    )}
                  />
                  <span className="min-w-0 flex-1 text-xs font-medium text-ink">
                    {r.label}
                  </span>
                  {r.count && (
                    <span className="shrink-0 text-[11px] font-bold text-brown">
                      {r.count}
                    </span>
                  )}
                </div>
              ))}
              <span className="h-px w-full bg-line" />
              <p className="text-[11px] leading-[1.8] font-medium text-brown">
                投稿者の履歴：過去の違反 0件 / 登録 342日 / 直近30日の記録
                21件。3か月前に「休みがち」→ 復帰したばかり。
              </p>
            </Card>
          </div>

          {/* 対応手順（削除を先行しない） */}
          <div className="flex items-start gap-2.5 rounded-[11px] border border-warn bg-warn-bg p-3.25">
            <HeartHandshake size={15} className="mt-0.5 shrink-0 text-warn" />
            <p className="text-[11px] leading-[1.7] font-semibold text-[#7a4f22]">
              自傷カテゴリの対応手順：削除を先行しない。まず相談窓口の案内を送信し、必要に応じて限定公開に切り替える。判断に迷う場合は必ずエスカレーション。
            </p>
          </div>

          <Card className="flex flex-col gap-2.5 p-3.5">
            <CardLabel className="text-[10px]">判定</CardLabel>
            <div className="flex flex-wrap gap-2">
              {MODERATION_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  className={cn(
                    "h-9.5 flex-1 rounded-[9px] border text-[11px] font-bold whitespace-nowrap transition-colors",
                    a.tone === "danger"
                      ? "border-danger text-danger hover:bg-danger-bg"
                      : a.tone === "warn"
                        ? "border-warn text-warn hover:bg-warn-bg"
                        : "border-line-strong text-brown hover:bg-surface",
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="対応メモ（監査ログに残ります）…"
              className="w-full resize-none rounded-[9px] border border-line-strong bg-surface p-2.75 text-[11px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
            />
          </Card>
        </Card>
      </div>
    </>
  );
}
