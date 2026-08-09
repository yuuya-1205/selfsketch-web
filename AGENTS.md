# AGENTS.md — AI エージェント向けガイド

SelfSketch モノレポ（frontend / backend / analysis）で作業するエージェントへの案内。
人間向けの詳細（画面一覧・ルート対応表・デモ URL）は `README.md` を参照。

## プロジェクト概要

- デザインの出典（source of truth）は Pencil ファイル `selfsketch.pen`（このリポジトリには含まれない）
- 3 スタック構成のモノレポ:

```
frontend/            React 19 + TypeScript + Tailwind v4（npm workspaces）
├── apps/web         ユーザー向け Web版（React Router + TanStack Query）
├── apps/admin       管理コンソール
└── packages/ui      デザイントークン（src/styles/theme.css）+ 共通プリミティブ（@selfsketch/ui）

backend/             Go + Gin の API サーバー（cmd/server + internal/api）

analysis/            分析基盤
├── frontend         React + TypeScript + Tailwind（独立した npm プロジェクト）
└── backend          Python + FastAPI（app/main.py）
```

- frontend のビルドは Vite、スタイルは Tailwind CSS v4（`@theme` によるトークン定義）
- frontend は npm workspaces。パッケージ間はソース直参照（`packages/ui` はビルドなし）

## コマンド

Node は `frontend/.nvmrc` の 22 系を使う。

```bash
# frontend（cd frontend で実行）
npm install
npm run dev          # web   -> http://localhost:5173（使用中なら自動繰り上がり）
npm run dev:admin    # admin -> http://localhost:5175
npm run typecheck    # 全 workspace の tsc --noEmit
npm run build        # 全 workspace のビルド（web/admin は tsc -b && vite build）
npm run lint         # ESLint（--max-warnings 0。警告も CI で落ちる）
npm run format:check # Prettier（.prettierignore のバックログは対象外。後述）
npm run test:run     # Vitest（watch なし）

# backend（cd backend で実行）
go run ./cmd/server  # -> http://localhost:8080
go build ./... && go vet ./... && go test ./...
gofmt -l .           # 出力が空なら整形済み

# analysis/frontend（cd analysis/frontend で実行）
npm install && npm run dev   # -> http://localhost:5177（/api は :8000 へプロキシ）
npm run lint && npm run format:check && npm run test:run

# analysis/backend（cd analysis/backend で実行）
pip install -r requirements-dev.txt   # 本番は requirements.txt のみ
uvicorn app.main:app --reload   # -> http://localhost:8000
ruff check . && ruff format --check . && python -m pytest
```

- **変更後は必ず該当ディレクトリで上記のチェックを通すこと**（CI と同じ内容）
- CI（`.github/workflows/ci.yml`）は frontend / backend / analysis-frontend / analysis-backend の 4 ジョブ。
  各ジョブが lint → format → typecheck → test → build を順に実行する

### 品質ツールの注意点

- **Prettier は段階導入**。`frontend/.prettierignore` の「バックログ」欄に挙げた 45 ファイルは
  導入前に書かれたもので整形対象外にしてある。触るときは 1 行消して
  `npx prettier --write <file>` し、整形コミットを分けること
- **TypeScript は 6 系で動いている**。`package.json` の宣言は `^7.0.2` だが、
  typescript-eslint が TS 7（ネイティブ移植版、JS コンパイラ API を持たない）に未対応のため
  実際には 6.0.3 が解決される。`docs/quality-tooling.md` 参照
- main へのマージで frontend が GitHub Pages に自動デプロイ（`deploy.yml`）。web は `/<repo>/`、admin は `/<repo>/admin/` 配信で、`BASE_PATH` 環境変数がビルド時に注入される。backend / analysis のデプロイ先は未定

## 重要な規約

### デザイントークン

- 色・角丸・フォントは `frontend/packages/ui/src/styles/theme.css` に集約。**コンポーネントに hex を直書きしない**
- トークンを変えるときは `.pen` ファイル側も必ず揃える（値の対応は theme.css のコメント参照）
- `.pen` → Tailwind の変換規則は `README.md` の「Pencil → Tailwind の対応」表に従う

### コード構成

- import は `@/` エイリアス（各 app の `src/` を指す）と `@selfsketch/ui` を使う
- web の画面は `frontend/apps/web/src/features/<機能名>/`、admin の画面は `frontend/apps/admin/src/pages/` に置く
- 共通 UI は `frontend/packages/ui/src/components/` に置き、`packages/ui/src/index.ts` から named export する
- サイドナビは `src/lib/nav.ts`（web）/ `ADMIN_NAV_GROUPS`（admin）で宣言的に管理。`.pen` のサイドバーコンポーネントと 1:1
- web の各ページは冒頭で `usePageMeta(パンくず, タイトル)` を呼び、トップバーと `document.title` を更新する
- モーダルはネストルート（`<Route path="new" element={<HabitFormModal />} />`）+ `<Outlet />` で出す

### データ層（frontend/apps/web/src/lib/api/）

- いまは全てモック。`useMockQuery` が `initialData` を渡すのでページ側にローディング分岐はない
- UI が依存する型は `types.ts` に集約。実 API 化の手順は `client.ts` のコメント参照
- mutation の実装例は `today.ts`（楽観更新 + 失敗時ロールバック）のみ

### TypeScript

- strict + `noUnusedLocals` / `noUnusedParameters` / `verbatimModuleSyntax` が有効。
  型だけの import は `import type` を使う。未使用の変数・引数は typecheck が落ちる

## レスポンシブ

| 幅 | 挙動 |
| --- | --- |
| `>= 1280` (xl) | サイドナビ 240px + 右レール |
| `768–1279` (md) | アイコンレール 76px、右レールは下へ回り込み |
| `< 768` | サイドナビ非表示 + 下部タブバー |

⚠️ Chrome ヘッドレスは `--window-size` を 560px 未満に縮められない。
狭幅の確認は固定幅 iframe に埋めてスクリーンショットを撮る（`.claude/skills/verify-ui` 参照）。

## プロジェクトスキル

定型作業の手順は `.claude/skills/` にまとめてある。該当する作業では必ず参照すること。

| スキル | 用途 |
| --- | --- |
| `add-screen` | web / admin に新しい画面（ルート）を追加する |
| `design-tokens` | 色・余白・角丸などトークンの追加・変更、`.pen` との同期 |
| `verify-ui` | dev サーバー起動とスクリーンショットによる画面検証 |

## 未実装（触るときは要相談）

認証、実 API、i18n、画像アセット（`Thumb` が暖色パレットで代替中）、
Admin の設定・権限画面。

API の設計方針と決定待ちの論点は `docs/api-contract.md` に整理してある。
