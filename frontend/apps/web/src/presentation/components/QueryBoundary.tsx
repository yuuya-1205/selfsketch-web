import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Lock, SearchX, TriangleAlert, WifiOff } from "lucide-react";
import { Button, ErrorState, InlineError } from "@selfsketch/ui";
import type { DomainError } from "@/domain/error";
import type { RepositoryResult } from "@/domain/repository/result";
import {
  ERROR_COPY,
  type ErrorCopy,
} from "@/presentation/constants/errorMessages";

const ICONS: Record<ErrorCopy["icon"], typeof WifiOff> = {
  "wifi-off": WifiOff,
  lock: Lock,
  "search-x": SearchX,
  "triangle-alert": TriangleAlert,
};

function ErrorIcon({ name, size }: { name: ErrorCopy["icon"]; size: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} />;
}

export interface QueryBoundaryProps<T> {
  /** Repository の読み取り結果。usecase 越しに受け取ったものをそのまま渡す */
  state: RepositoryResult<T>;
  /** 読み込み中に出すもの。形は画面ごとに違うので必須にしている */
  skeleton: ReactNode;
  /** 「再試行」を押したときの再取得。省くとボタンを出さない */
  onRetry?: () => void;
  /**
   * 画面の一部だけを預けるときに true。
   * 他の内容は表示したまま、その区画だけを差し替える（.pen の「インライン」）。
   */
  inline?: boolean;
  children: (data: T) => ReactNode;
}

/**
 * 取得の 3 状態（読み込み中 / 失敗 / 成功）を 1 箇所にまとめる。
 *
 * 実 API に繋ぐと `initialData` が消えて全画面にこの分岐が要る
 * （`docs/api-contract.md` §4 のステップ 4）。画面ごとに書くと必ずばらつくので、
 * 文言とレイアウトはここに集約する。
 */
export function QueryBoundary<T>({
  state,
  skeleton,
  onRetry,
  inline,
  children,
}: QueryBoundaryProps<T>) {
  if (state.error) {
    return (
      <QueryErrorView error={state.error} onRetry={onRetry} inline={inline} />
    );
  }

  // データが無いあいだは読み込み中として扱う（error が無いなら取得途中）
  if (state.isLoading || state.data === undefined) return <>{skeleton}</>;

  return <>{children(state.data)}</>;
}

/**
 * 失敗したときの表示だけを取り出したもの。
 *
 * 既に `if (isLoading || !data) return <Skeleton/>` で早期 return している画面は、
 * その手前に `if (error) return <QueryErrorView .../>` を足すのが最小の差分になる。
 * これから書く画面は `QueryBoundary` で包むほうが分岐を落としにくい。
 */
export function QueryErrorView({
  error,
  onRetry,
  inline,
}: {
  error: DomainError;
  onRetry?: () => void;
  inline?: boolean;
}) {
  const navigate = useNavigate();
  const copy = ERROR_COPY[error.code];

  // 期限切れは再試行しても直らない。ログインへ送るのが唯一の出口
  if (error.code === "unauthorized") {
    const action = (
      <Button size="sm" onClick={() => navigate("/login")}>
        ログインする
      </Button>
    );

    return inline ? (
      <InlineError
        icon={<ErrorIcon name={copy.icon} size={15} />}
        title={copy.title}
        body={copy.body}
        tone="danger"
        action={action}
      />
    ) : (
      <ErrorState
        icon={<ErrorIcon name={copy.icon} size={22} />}
        title={copy.title}
        body={copy.body}
        actions={action}
      />
    );
  }

  if (inline) {
    return (
      <InlineError
        icon={<ErrorIcon name={copy.icon} size={15} />}
        title={copy.title}
        body="他の内容は表示できています。"
        action={
          onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              再試行
            </Button>
          )
        }
      />
    );
  }

  return (
    <ErrorState
      icon={<ErrorIcon name={copy.icon} size={22} />}
      title={copy.title}
      body={copy.body}
      actions={
        onRetry && (
          <Button size="sm" onClick={onRetry}>
            再試行
          </Button>
        )
      }
    />
  );
}
