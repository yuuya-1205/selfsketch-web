import { Card } from "@selfsketch/ui";
import { usePageMeta } from "@/lib/usePageMeta";

export interface PlaceholderPageProps {
  title: string;
  crumb: string;
}

/** 未実装画面の受け皿。ナビゲーションの疎通確認用 */
export function PlaceholderPage({ title, crumb }: PlaceholderPageProps) {
  usePageMeta(crumb, title);

  return (
    <Card
      tone="surface"
      className="grid flex-1 place-items-center border-dashed p-10 text-center"
    >
      <div className="flex max-w-md flex-col gap-2">
        <p className="text-lg font-bold text-ink">{title}</p>
        <p className="text-xs leading-relaxed text-brown">
          この画面はまだ実装していません。デザインは selfsketch.pen の
          「Web版 (Responsive) - SelfSketch」に揃っています。
        </p>
      </div>
    </Card>
  );
}
