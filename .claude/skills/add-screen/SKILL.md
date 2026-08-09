---
name: add-screen
description: selfsketch-web に新しい画面・ページ・ルート・モーダルを追加するときの手順。「〜画面を作って」「〜ページを追加」「新しいルートを足す」「設定画面のプレースホルダを実装に置き換える」など、web版（frontend/apps/web）または管理コンソール（frontend/apps/admin）に UI 画面を増やす・置き換える作業では必ずこのスキルに従うこと。
---

# 画面追加の手順

新しい画面は必ず `.pen` デザイン上のノード（例: `W-Set 4`, `Adm 9`）に対応させる。
対応ノードが不明な場合は、どのデザインを実装するのかをユーザーに確認してから着手する。

## web版（frontend/apps/web）の場合

1. **API モジュール**（データが要る場合）: `src/lib/api/<機能名>.ts` を作る
   - UI が依存する型は `src/lib/api/types.ts` に追加
   - `useMockQuery(["キー"], モック値)` を返すフックをエクスポート（既存の `streak.ts` が手本）
   - モックデータは日本語で、デザインカンプの文言に合わせる
2. **ページコンポーネント**: `src/features/<機能名>/XxxPage.tsx` を作る
   - 冒頭で `usePageMeta("パンくず(ナビグループ名)", "画面タイトル")` を呼ぶ
   - `@selfsketch/ui` のプリミティブ（Card, PageHeader, StatCard, Badge…）を最大限使う。
     足りないプリミティブは `frontend/packages/ui` に追加して `index.ts` から export する
   - 色は Tailwind のトークンクラス（`bg-paper`, `text-ink`, `border-line` など）のみ。hex 直書き禁止
3. **ルート登録**: `src/App.tsx` に `<Route>` を追加
   - ログイン後の画面は `<Route element={<AppShell />}>` の中に置く
   - モーダルは親ルートのネストルートにして、親ページ側に `<Outlet />` を置く（`/today/new` が手本）
4. **ナビ**: サイドナビに載せる画面なら `src/lib/nav.ts` の `NAV_GROUPS` に追加
   （`.pen` の "Web Sidebar" と 1:1 なので、デザイン側にない項目は勝手に足さない）
5. **README 更新**: `README.md` の画面一覧表に「ルート / 画面名 / .pen ノード」の行を追加。
   画面数（見出しの「Web版 32画面」）も更新する

## 管理コンソール（frontend/apps/admin）の場合

1. モックデータは `src/lib/api/mock.ts` に追加
2. ページは `src/pages/XxxPage.tsx` に作る（features 分割はしない）
3. `src/App.tsx` の `<Route element={<AdminShell />}>` 内にルート追加
4. ナビは `src/lib/nav.ts` の `ADMIN_NAV_GROUPS`（`.pen` の "Admin Sidebar" と 1:1）
5. README の管理コンソール表を更新
6. **個人データの扱い**: 記録本文・作品画像は既定でマスクし、開示リクエスト経由で
   閲覧する導線にする（`.pen` の「A6. 設計メモ」の方針。`ModerationPage` が手本）

## 仕上げ（共通）

- **着手前に `split-work` スキルで PR / コミットの分割計画を立てる。画面は 1 枚 1 コミット、
  共通コンポーネント（`packages/ui`）の追加は利用側の画面と別コミットにする**
- `npm run typecheck` を通す（strict + noUnusedLocals なので未使用 import で落ちる）
- レスポンシブ確認: xl / md / モバイル幅の3段階（詳細は `verify-ui` スキル）
- 可能なら `verify-ui` スキルの手順でスクリーンショットを撮って確認する
