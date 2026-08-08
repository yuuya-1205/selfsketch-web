import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bold,
  Check,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  Quote,
  Image as ImageIcon,
  Undo2,
} from "lucide-react";
import {
  BackLink,
  Button,
  Card,
  CardLabel,
  Chip,
  RadioDot,
  SelectDisplay,
  cn,
} from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";

const TOOLS = [Bold, Italic, List, Quote, ImageIcon, LinkIcon, Undo2];
const MOODS = ["◦", "○", "◍", "●", "◉"];
const SHORTCUTS = ["⌘ + S  保存", "⌘ + Enter  公開", "⌘ + K  検索"];

export function JournalEditorPage() {
  usePageMeta("メイン / ジャーナル", "エントリーを書く");
  const navigate = useNavigate();
  const [mood, setMood] = useState(3);
  const [visibility, setVisibility] = useState("自分だけ");
  const [body, setBody] = useState(
    "手首から動かす感覚が、やっと少しわかった気がする。今までは指先だけで描こうとしていたから、線が細切れになっていた。今日は肩から腕、手首へ力が抜けていって、一本の線がすっと引けた。\n\n5分だけのつもりが15分。楽しくなってしまった日は、そのまま描いていいことにしている。",
  );

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-3">
        <BackLink onClick={() => navigate("/journal")}>一覧にもどる</BackLink>
        <span className="h-px flex-1" />
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
          <Check size={13} />
          下書きを自動保存しました · 7:32
        </span>
        <Button variant="outline">プレビュー</Button>
        <Button onClick={() => navigate("/journal")}>保存する</Button>
      </div>

      <div className="flex w-full flex-1 flex-col gap-4.5 xl:flex-row">
        <Card className="flex min-w-0 flex-1 flex-col gap-3.5 rounded-2xl p-5 lg:p-6.5">
          <div className="flex items-center gap-1 border-b border-line pb-3">
            {TOOLS.map((Icon, i) => (
              <button
                key={i}
                type="button"
                className="grid size-8 place-items-center rounded-lg text-brown transition-colors hover:bg-surface"
              >
                <Icon size={15} />
              </button>
            ))}
            <span className="h-px flex-1" />
            <span className="text-[11px] font-medium text-muted">
              {body.length} 文字
            </span>
          </div>

          <span className="text-[11px] font-semibold tracking-[1.2px] text-muted">
            2026年4月22日 (火)
          </span>

          <input
            defaultValue="線が迷わなくなってきた"
            aria-label="タイトル"
            className="w-full bg-transparent text-[28px] font-bold text-ink placeholder:text-line-strong focus:outline-none"
            placeholder="タイトル"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-label="本文"
            className="min-h-50 w-full flex-1 resize-none bg-transparent text-[15px] leading-[2.1] text-ink focus:outline-none"
          />

          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface">
            <ImagePlus size={22} className="text-brown" />
            <span className="text-xs font-semibold text-brown">
              スケッチ画像をドラッグ＆ドロップ（Web版のみ）
            </span>
            <span className="text-[11px] text-muted">
              PNG / JPG / HEIC · 最大 20MB
            </span>
          </div>
        </Card>

        <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[280px]">
          <Card tone="surface" className="flex flex-col gap-2.5 p-4">
            <CardLabel>紐づける習慣</CardLabel>
            <SelectDisplay value="5分スケッチ" className="h-10 bg-paper" />
          </Card>

          <Card tone="surface" className="flex flex-col gap-3 p-4">
            <CardLabel>今日の気分</CardLabel>
            <div className="flex justify-between gap-1.5">
              {MOODS.map((g, i) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setMood(i)}
                  className={cn(
                    "grid size-10 place-items-center rounded-[10px] border text-[15px] font-semibold transition-colors",
                    i === mood
                      ? "border-ink bg-ink text-paper"
                      : "border-line-strong bg-paper text-brown",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </Card>

          <Card tone="surface" className="flex flex-col gap-2.5 p-4">
            <CardLabel>タグ</CardLabel>
            <div className="flex flex-wrap gap-1.5">
              <Chip>#継続14日目</Chip>
              <Chip>#朝</Chip>
              <Chip className="text-muted">+ 追加</Chip>
            </div>
          </Card>

          <Card className="flex flex-1 flex-col gap-2.5 p-4">
            <CardLabel>公開範囲</CardLabel>
            {["自分だけ", "フレンドに公開"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className="flex items-center gap-2.5 text-left"
              >
                <RadioDot checked={visibility === v} />
                <span className="text-[13px] font-medium text-ink">{v}</span>
              </button>
            ))}

            <Card tone="surface" className="mt-auto flex flex-col gap-1.5 border-0 p-3">
              <CardLabel className="text-[10px]">ショートカット</CardLabel>
              {SHORTCUTS.map((s) => (
                <span key={s} className="text-[11px] font-medium text-brown">
                  {s}
                </span>
              ))}
            </Card>
          </Card>
        </aside>
      </div>
    </>
  );
}
