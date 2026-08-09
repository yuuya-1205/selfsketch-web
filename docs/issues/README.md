# イシュー添付画像

GitHub イシューから参照する Before / After のスクリーンショット置き場。

- **Before** … 実装前の現物。dev サーバーを起動してヘッドレス Chrome で撮る
  （手順は `.claude/skills/verify-ui`）
- **After** … `selfsketch.pen` の該当ノードを `export_nodes` で書き出したもの。
  **デザインが未確定の課題には After が無い**。その場合はイシュー本文にそう書く

命名は `<主題>-before.png` / `<主題>-after.png`。イシューからは main の raw URL で参照する。

```
https://raw.githubusercontent.com/yuuya-1205/selfsketch-web/main/docs/issues/<file>
```

実装が済んだ画像は消さずに残す。「いつどう変わったか」を後から追えるようにするため。
