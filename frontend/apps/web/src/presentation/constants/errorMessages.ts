import type { DomainErrorCode } from "@/domain/error";

export interface ErrorCopy {
  title: string;
  body: string;
  /** lucide のアイコン名。QueryBoundary が解決する */
  icon: "wifi-off" | "lock" | "search-x" | "triangle-alert";
}

/**
 * DomainError の code ごとの文言（.pen の W-State 1 の設計メモ）。
 * `detail` は開発者向けなので画面には出さない。
 *
 * 文面は UX Writing ガイドラインに従う:
 * 「エラーが発生しました」ではなく「うまくいきませんでした。もう一度。」。
 * カタカナよりひらがな、「！」より「。」。
 */
export const ERROR_COPY: Record<DomainErrorCode, ErrorCopy> = {
  network: {
    title: "つながりませんでした",
    body: "電波の良いところで、もう一度お試しください。書きかけの記録は端末に残しています。",
    icon: "wifi-off",
  },
  unauthorized: {
    title: "ログインの有効期限が切れました",
    body: "もう一度ログインしてください。入力中の内容は保持されます。",
    icon: "lock",
  },
  not_found: {
    title: "見つかりませんでした",
    body: "移動したか、消されたのかもしれません。ひとつ前に戻ってみてください。",
    icon: "search-x",
  },
  conflict: {
    title: "ほかの変更と重なりました",
    body: "別の端末での更新と行き違ったようです。読み直してからお試しください。",
    icon: "triangle-alert",
  },
  invalid: {
    title: "この内容では保存できません",
    body: "入力を見直してから、もう一度お試しください。",
    icon: "triangle-alert",
  },
  unknown: {
    title: "うまくいきませんでした",
    body: "しばらく置いてから、もう一度。直らないときは時間をおいてお試しください。",
    icon: "triangle-alert",
  },
};
