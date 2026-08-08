import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Chip, FieldLabel, Textarea } from "@selfsketch/ui";
import {
  AuthBody,
  AuthKicker,
  AuthLayout,
  AuthTitle,
} from "@/components/layout/AuthLayout";

const SUGGESTIONS = ["絵がうまくなりたい", "早起きしたい", "本を読む人に"];
const MAX = 200;

export function GoalPage() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState(
    "毎日すこしずつ絵を描いて、1年後には自分の作品集をつくりたい。人に見せられる一枚を残したい。",
  );

  return (
    <AuthLayout
      step={2}
      stepLabel="STEP 2 / 4 — なりたい自分"
      title="なりたい自分"
    >
      <AuthKicker>YOUR GOAL</AuthKicker>
      <AuthTitle>どんな自分に なりたい？</AuthTitle>
      <AuthBody>
        言葉にするほど、AIが描く「未来の自分」の解像度が上がります。
      </AuthBody>

      <div className="flex flex-col gap-1.5">
        <Textarea
          value={goal}
          maxLength={MAX}
          rows={5}
          onChange={(e) => setGoal(e.target.value)}
          aria-label="なりたい自分"
        />
        <span className="self-end text-[11px] font-medium text-muted">
          {goal.length} / {MAX}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>よくある願い</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Chip key={s} onClick={() => setGoal((g) => `${g}${g ? " " : ""}${s}`)}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      <Button size="lg" block onClick={() => navigate("/onboarding/future")}>
        次へ
      </Button>
    </AuthLayout>
  );
}
