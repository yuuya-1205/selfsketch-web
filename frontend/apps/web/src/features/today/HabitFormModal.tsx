import { useState } from "react";
import { useNavigate } from "react-router";
import { Moon } from "lucide-react";
import {
  Button,
  Card,
  Field,
  FieldLabel,
  Input,
  Modal,
  SelectDisplay,
  Switch,
  cn,
} from "@selfsketch/ui";

/** 「今日」の上に重ねて表示する習慣作成モーダル */
/** 頻度の選択肢。API のデータではなくフォームの選択肢なので画面が持つ */
const FREQUENCY_OPTIONS = ["毎日", "平日のみ", "週3回", "カスタム"] as const;

export function HabitFormModal() {
  const navigate = useNavigate();
  const close = () => navigate("/today");
  const [freq, setFreq] = useState<string>(FREQUENCY_OPTIONS[0]);
  const [linked, setLinked] = useState(true);

  return (
    <Modal
      onClose={close}
      title="新しい習慣をつくる"
      description="小さく始めるほど続きます"
      width={560}
      footer={
        <>
          <Button variant="outline" onClick={close}>
            キャンセル
          </Button>
          <Button onClick={close}>習慣を作成</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4.5 p-6">
        <Field label="習慣の名前">
          <Input defaultValue="5分スケッチ" />
        </Field>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>頻度</FieldLabel>
          <div className="flex gap-2">
            {FREQUENCY_OPTIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setFreq(o)}
                className={cn(
                  "h-[38px] flex-1 rounded-[10px] border text-xs font-semibold transition-colors",
                  o === freq
                    ? "border-ink bg-ink text-paper"
                    : "border-line-strong bg-paper text-brown hover:bg-surface",
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Field label="時間帯">
            <SelectDisplay value="毎朝 7:00" />
          </Field>
          <Field label="所要時間">
            <SelectDisplay value="5分" />
          </Field>
        </div>

        <Card
          tone="surface"
          className="flex items-center gap-3 border-line p-3.5"
        >
          <Moon size={16} className="shrink-0 text-brown" />
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-ink">
              「1年後の自分」に紐づける
            </span>
            <span className="text-[11px] text-muted">
              未来の自分の進捗に反映されます
            </span>
          </span>
          <Switch
            checked={linked}
            onChange={setLinked}
            label="1年後の自分に紐づける"
          />
        </Card>
      </div>
    </Modal>
  );
}
