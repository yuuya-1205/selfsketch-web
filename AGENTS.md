# AGENTS.md — AI エージェント向けガイド

SelfSketch フロントエンド モノレポで作業するエージェントへの案内。
人間向けの詳細（画面一覧・ルート対応表・デモ URL）は `README.md` を参照。

## プロジェクト概要

- デザインの出典（source of truth）は Pencil ファイル `selfsketch.pen`（このリポジトリには含まれない）
- `apps/web` … ユーザー向け Web版（React 19 + React Router + TanStack Query）
- `apps/admin` … 管理コンソール（React 19 + React Router）
- `packages/ui` … デザイントークン（`src/styles/theme.css`）+ 共通プリミティブ（`@selfsketch/ui`）
- ビルドは Vite、スタイルは Tailwind CSS v4（`@theme` によるトークン定義）
- npm workspaces。パッケージ間はソース直参照（`packages/ui` はビルドなし）

## コマンド

Node は `.nvmrc` の 22 系を使う。

```bash
npm install
npm run dev          # web   -> http://localhost:5173（使用中なら自動繰り上がり）
npm run dev:admin    # admin -> http://localhost:5175
npm run typecheck    # 全 workspace の tsc --noEmit
npm run build        # 全 workspace のビルド（web/admin は tsc -b && vite build）
```

- テスト・lint は未導入。**変更後は必ず `npm run typecheck` を通すこと**（CI と同じチェック）
- CI（`.github/workflows/ci.yml`）は typecheck + build のみ
- main へのマージで GitHub Pages に自動デプロイ（`deploy.yml`）。web は `/<repo>/`、admin は `/<repo>/admin/` 配信で、`BASE_PATH` 環境変数がビルド時に注入される

## 重要な規約

### デザイントークン

- 色・角丸・フォントは `packages/ui/src/styles/theme.css` に集約。**コンポーネントに hex を直書きしない**
- トークンを変えるときは `.pen` ファイル側も必ず揃える（値の対応は theme.css のコメント参照）
- `.pen` → Tailwind の変換規則は `README.md` の「Pencil → Tailwind の対応」表に従う

### コード構成

- import は `@/` エイリアス（各 app の `src/` を指す）と `@selfsketch/ui` を使う
- web の画面は `apps/web/src/features/<機能名>/`、admin の画面は `apps/admin/src/pages/` に置く
- 共通 UI は `packages/ui/src/components/` に置き、`packages/ui/src/index.ts` から named export する
- サイドナビは `src/lib/nav.ts`（web）/ `ADMIN_NAV_GROUPS`（admin）で宣言的に管理。`.pen` のサイドバーコンポーネントと 1:1
- web の各ページは冒頭で `usePageMeta(パンくず, タイトル)` を呼び、トップバーと `document.title` を更新する
- モーダルはネストルート（`<Route path="new" element={<HabitFormModal />} />`）+ `<Outlet />` で出す

### データ層（apps/web/src/lib/api/）

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

認証、実 API、i18n、テスト、画像アセット（`Thumb` が暖色パレットで代替中）、Admin の設定画面。
