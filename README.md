# selfsketch-web

SelfSketch のフロントエンド モノレポ。デザインの出典は Pencil ファイル `selfsketch.pen`。

```
apps/web     ユーザー向け Web版      (localhost:5173)
apps/admin   管理コンソール          (localhost:5175)
packages/ui  デザイントークン + 共通プリミティブ
```

## セットアップ

Node は `.nvmrc` の 22 系を使う。

```bash
nvm use
npm install
npm run dev        # web   -> http://localhost:5173（使用中なら自動で繰り上がる）
npm run dev:admin  # admin -> http://localhost:5175
npm run typecheck
npm run build
```

## デザインとの対応

| 実装 | .pen 上のノード |
| --- | --- |
| `packages/ui/src/styles/theme.css` | Web版ボード先頭の Tokens カード |
| `apps/web` の `Sidebar` | `Web Sidebar`（reusable コンポーネント） |
| `apps/web` の `AppShell` | `Web Screen Template` |
| `apps/web/src/features/today` | `W-Home 1 - 今日ダッシュボード` |
| `apps/admin` の `AdminSidebar` / `AdminShell` | `Admin Sidebar` / `Admin Screen Template` |
| `apps/admin` の `OverviewPage` | `Adm 1 - 概要ダッシュボード` |

色・余白を変えるときは **必ず `.pen` と両方**を更新すること。値は `theme.css`
に集約してあるので、hex を直書きしない。

### Pencil → Tailwind の対応

| .pen | Tailwind |
| --- | --- |
| `layout: "vertical" / "horizontal"` | `flex flex-col` / `flex flex-row` |
| `width: "fill_container"`（主軸） | `flex-1` |
| `width: "fill_container"`（交差軸） | `w-full` / `self-stretch` |
| `fit_content` | 指定なし |
| `padding: [14,16]` | `py-3.5 px-4` |
| `stroke` + `strokeAlignment:"inner"` | `border border-line` + `box-border` |
| フレームの `height: 900` | `h-dvh`（アートボードの高さは実装に持ち込まない） |
| `layoutPosition: "absolute"` のオーバーレイ | `fixed inset-0 z-50` |

## ブレイクポイント

`.pen` の「13. Responsive」に対応。

| 幅 | 挙動 |
| --- | --- |
| `>= 1280` (xl) | サイドナビ 240px + 右レール（2カラム） |
| `768–1279` (md) | サイドナビ 76px アイコンレール、右レールは下へ回り込み |
| `< 768` | サイドナビ非表示 + 下部タブバー（アプリと同じ操作系） |

## データ層

`apps/web/src/lib/api/` が API 境界。いまはモック。

- `types.ts` … UI が依存する型。バックエンド実装後は OpenAPI / Protobuf 生成物に差し替える
- `today.ts` … `fetchTodayDashboard` / `toggleHabit` の中身を `fetch` に置き換えるだけで実APIに繋がる。
  呼び出し側（`useTodayDashboard` 以降）は変更不要

チェックの ON/OFF は TanStack Query の楽観更新で即座に反映し、失敗時はロールバックする。

## 未実装

- Web版: 今日ダッシュボード以外の画面（ナビゲーションはプレースホルダに繋がっている）
- Admin: 概要の KPI 以外
- 認証、実 API、i18n、テスト
