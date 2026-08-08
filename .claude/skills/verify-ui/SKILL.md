---
name: verify-ui
description: selfsketch-web の画面を実際に起動して見た目を検証する手順。dev サーバーの起動、ヘッドレス Chrome / Playwright でのスクリーンショット撮影、レスポンシブ3段階（xl / md / モバイル）の確認方法。「画面を確認して」「スクショを撮って」「見た目が崩れてないか見て」「レスポンシブを検証」など、UI 変更の目視確認が必要な作業では必ずこのスキルに従うこと。
---

# UI 検証の手順

## dev サーバー起動

```bash
cd frontend && npm run dev &        # web   -> http://localhost:5173
cd frontend && npm run dev:admin &  # admin -> http://localhost:5175
```

- ポートが使用中だと Vite が自動で繰り上げる（5174 など）。起動ログで実際のポートを確認する
- バックグラウンド起動後、`curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` で疎通確認

## スクリーンショット撮影

Playwright + プリインストールの Chromium を使う（`playwright install` は不要）。

```js
// screenshot.mjs — スクラッチパッドに置いて node で実行
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5173/today");
await page.waitForTimeout(500); // フォント・チャート描画待ち
await page.screenshot({ path: "today-xl.png", fullPage: true });
await browser.close();
```

環境に `@playwright/test` がない場合は `npm i -D playwright` せず、
`chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })` を試す。

## レスポンシブは3段階すべて確認する

| viewport 幅 | 期待される挙動 |
| --- | --- |
| 1440（xl） | サイドナビ 240px + 右レール2カラム |
| 1024（md） | アイコンレール 76px、右レールは下へ回り込み |
| 390（モバイル） | サイドナビ非表示 + 下部タブバー |

⚠️ **ヘッドレス Chrome を CLI の `--window-size` で 560px 未満にしてもウィンドウは縮まない**
（OS の最小ウィンドウ幅）。Playwright の `viewport` 指定なら問題ない。
CLI 直叩きで狭幅を確認する場合は、固定幅 iframe に埋めた HTML を作って撮影する:

```html
<iframe src="http://localhost:5173/today" style="width:390px;height:844px;border:0"></iframe>
```

## 確認ポイント

- 文字のはみ出し・折り返し（日本語の長文ラベルで起きやすい）
- トークン外の色が紛れ込んでいないか（背景は `paper`、カードは `surface` 系のはず）
- モーダル系ルート（`/today/new` など）は親画面の上にオーバーレイで出るか
- `docs/screenshots/` に既存画面の正解スクリーンショットがあるので、迷ったら比較する

## 片付け

検証が終わったらバックグラウンドの dev サーバーを止める（`kill %1` など）。
スクリーンショットは原則スクラッチパッドに保存し、リポジトリにはコミットしない
（`docs/screenshots/` の更新を明示的に頼まれた場合を除く）。
