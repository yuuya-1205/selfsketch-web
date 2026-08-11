import { useNavigate } from "react-router";
import { Button } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";
import { CLOSING } from "@/presentation/constants/reflectionContent";

export function ClosingPage() {
  usePageMeta("分析・つながり", "今日はここまで");
  const navigate = useNavigate();

  return (
    <div className="-m-4 flex flex-1 flex-col items-center justify-center gap-6 bg-nav px-6 py-14 md:-m-7 md:px-30">
      <div className="flex w-full max-w-160 flex-col items-center gap-5.5">
        <span className="text-[11px] font-bold tracking-[2px] text-nav-label">
          {CLOSING.dateLabel}
        </span>

        <h2 className="text-[40px] leading-tight font-bold text-paper">
          {CLOSING.title}
        </h2>

        <p className="text-center text-[15px] leading-[2.1] whitespace-pre-line text-nav-fg">
          {CLOSING.summary}
        </p>

        <div className="flex w-full gap-3">
          {CLOSING.stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-nav-card px-2.5 py-3.5"
            >
              <span className="text-[10px] font-semibold tracking-[1px] text-nav-icon">
                {s.label}
              </span>
              <span className="text-lg font-bold text-paper">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col items-center gap-2 rounded-[14px] border border-nav-active px-5 py-5">
          <span className="text-[10px] font-bold tracking-[1.4px] text-nav-label">
            明日のあなたへ
          </span>
          <p className="text-base font-bold text-line">{CLOSING.tomorrow}</p>
        </div>

        <div className="flex gap-3">
          <Button size="lg" variant="inverse" onClick={() => navigate("/today")}>
            おやすみ
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="border border-nav-label text-line hover:bg-nav-active"
            onClick={() => navigate("/reflection")}
          >
            もう少し見る
          </Button>
        </div>
      </div>
    </div>
  );
}
