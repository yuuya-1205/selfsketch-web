# selfsketch-web

SelfSketch のフロントエンド モノレポ。デザインの出典は Pencil ファイル `selfsketch.pen`。

```
apps/web     ユーザー向け Web版      (localhost:5173)
apps/admin   管理コンソール          (localhost:5175)
packages/ui  デザイントークン + 共通プリミティブ
```

## セットアップ

Node は `.nvmrc` の 22 系を使う（Homebrew の node は icu4c の不整合で動かない環境あり）。

```bash
nvm use
npm install
npm run dev        # web   -> http://localhost:5173（使用中なら自動で繰り上がる）
npm run dev:admin  # admin -> http://localhost:5175
npm run typecheck
npm run build
```

## 実装済みの画面（Web版 32画面）

| ルート | 画面 | .pen 上のノード |
| --- | --- | --- |
| `/welcome` | ようこそ | W-Onb 1 |
| `/onboarding/goal` | なりたい自分 | W-Onb 2 |
| `/onboarding/future` | AI 未来の自分 | W-Onb 3 |
| `/onboarding/first-habit` | 最初の習慣 | W-Onb 4 |
| `/today` | 今日ダッシュボード | W-Home 1 |
| `/today/new` | 習慣を作成（モーダル） | W-Home 2 |
| `/habits/:habitId` | 習慣詳細 | W-Home 3 |
| `/streak` | 軌跡 | W-Streak 1 |
| `/streak/milestone` | マイルストーン祝福 | W-Streak 2 |
| `/journal`, `/journal/:entryId` | ジャーナル 2ペイン | W-Journal 1 |
| `/journal/new` | 執筆エディタ | W-Journal 2 |
| `/gallery` | ギャラリー タイムライン | W-Gallery 1 |
| `/gallery/grid` | ギャラリー グリッド | W-Gallery 2 |
| `/gallery/grid/:itemId` | ライトボックス | W-Gallery 2 |
| `/future` | ビジョンボード | W-Future 1 |
| `/future/:visionId` | ビジョン詳細 | W-Future 2 |
| `/insights` | インサイト | W-Insights 1 |
| `/insights/monthly` | 月次レポート | W-Insights 2 |
| `/friends` | フレンド | W-Social 1 |
| `/friends/share` | シェアカード作成 | W-Social 2 |
| `/notifications` | 通知センター | W-Notif 1 |
| `/settings` | 一般設定 | W-Set 1 |
| `/settings/account` | アカウント | W-Set 2 |
| `/settings/subscription` | サブスクリプション | W-Set 3 |
| `/premium` | Premium アップグレード | W-Premium 1 |
| `/reflection` | リフレクション ハブ | W-Rf 1 |
| `/reflection/daily` | 今日のリフレクション | W-Rf 2 |
| `/reflection/compare` | 6か月比較 | W-Rf 3 |
| `/reflection/timeline` | 未来タイムライン | W-Rf 4 |
| `/reflection/century` | 100年ライフ | W-Rf 5 |
| `/reflection/backcast` | 逆算プラン | W-Rf 6 |
| `/reflection/vision` | ビジョンボード | W-Rf 7 |
| `/reflection/closing` | 一日の締めくくり | W-Rf 8 |

`/settings/privacy` `/settings/data` `/settings/help` はデザイン未確定のためプレースホルダ。

## デザインとの対応

| 実装 | .pen 上のノード |
| --- | --- |
| `packages/ui/src/styles/theme.css` | Web版ボード先頭の Tokens カード |
| `apps/web` の `Sidebar` | `Web Sidebar`（reusable コンポーネント） |
| `apps/web` の `AppShell` | `Web Screen Template` |
| `apps/web` の `AuthLayout` | `Web Auth Template` |
| `apps/admin` の `AdminSidebar` / `AdminShell` | `Admin Sidebar` / `Admin Screen Template` |

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

> ⚠️ 検証メモ: Chrome ヘッドレスは `--window-size` を 560px 未満に縮めても
> レイアウト幅が縮まらない（OS の最小ウィンドウ幅）。狭い幅を確認するときは
> 固定幅の iframe に埋めてスクリーンショットを撮ること。

## データ層

`apps/web/src/lib/api/` が API 境界。いまはモック。

- `types.ts` … UI が依存する型。バックエンド実装後は OpenAPI / Protobuf 生成物に差し替える
- `client.ts` … `useMockQuery` が `initialData` を渡しているので、ページ側にローディング分岐がない。
  実 API 化の手順は `queryFn` を `fetch` に変える → `initialData` を外す → 各ページに
  ローディング表示を足す、の3ステップ
- `today.ts` … 唯一 mutation まで実装済み。習慣のチェックは楽観更新 + 失敗時ロールバック

## 未実装

- 認証、実 API、i18n、テスト
- Admin: 概要の KPI 以外（グラフ・テーブル・残り7画面）
- 画像アセット（作品サムネイルは `Thumb` が暖色パレットで代替中）
