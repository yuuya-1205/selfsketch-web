# スクリーンショット

`apps/web` を Chrome ヘッドレスで 1440×900 描画したもの。
再取得するときは dev サーバーを起動して以下を実行する。

```bash
npm run dev
# 別ターミナルで
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --window-size=1440,900 \
  --screenshot=/tmp/shot.png --virtual-time-budget=3500 \
  "http://localhost:5173/today"
```

> 狭い幅を確認するときは注意。Chrome ヘッドレスは `--window-size` を
> 560px 未満にしてもレイアウト幅が縮まらない（OS の最小ウィンドウ幅）。
> `00-responsive.jpg` のように固定幅の iframe に埋めて撮ること。
