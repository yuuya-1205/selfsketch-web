---
name: design-tokens
description: selfsketch-web の色・余白・角丸・フォントなどデザイントークンの追加・変更・リネームと、Pencil ファイル（selfsketch.pen）との同期ルール。「色を変えて」「テーマをいじる」「新しい色が必要」「角丸を調整」「ダークモード対応」など、見た目のスタイル値に触れる作業では必ずこのスキルに従うこと。
---

# デザイントークンの扱い

## 大原則

1. **source of truth は `selfsketch.pen`**（Pencil デザインファイル。リポジトリ外）。
   実装側の写しが `packages/ui/src/styles/theme.css` の `@theme` ブロック
2. **hex やピクセル値をコンポーネントに直書きしない**。必ず theme.css のトークンを
   Tailwind クラス経由で使う（`bg-paper`, `text-ink`, `border-line-strong`, `rounded-card` など）
3. トークンを追加・変更したら、**`.pen` 側も更新が必要である旨を必ずユーザーに伝える**。
   エージェントは `.pen` を直接編集できないことが多いので、変更した値の一覧
   （トークン名 / 旧値 / 新値）を最後に報告すること

## トークンの構成（theme.css）

| グループ | 例 | 用途 |
| --- | --- | --- |
| surface | `--color-paper` `--color-surface` `--color-track` `--color-line` | 地色・カード・罫線 |
| text | `--color-ink` `--color-brown` `--color-muted` | 主要 / 副次 / キャプション |
| navigation | `--color-nav-*` | ダークなサイドナビ専用 |
| admin only | `--color-admin-nav-*` `--color-ok/warn/danger(-bg)` | 管理コンソールとステータス色 |
| radius | `--radius-card` `--radius-control` `--radius-row` | 角丸3種 |
| type | `--font-sans` | Inter → Noto Sans JP の順を崩さない（日本語グリフのため） |

Tailwind v4 の `@theme` なので、`--color-foo` を足せば `bg-foo` / `text-foo` /
`border-foo` が自動で使えるようになる。`tailwind.config` は存在しない。

## 新しい色が必要になったら

1. まず既存トークンで表現できないか検討する（例: 成功系は `--color-ok` / `--color-ok-bg` が既にある）
2. 本当に必要なら theme.css の該当グループに、既存の命名規則
   （役割ベース: `paper`, `ink`, `warn` など。色名ベースは避ける）で追加
3. コメントで用途を一行書く（既存行のスタイルに合わせる）
4. `.pen` 側の Tokens カードにも同じ値を追加するようユーザーに伝える

## 値の変換規則（.pen → Tailwind）

README.md の「Pencil → Tailwind の対応」表に従う。要点:

- `padding: [14,16]` → `py-3.5 px-4`（4px = 1 単位）
- `stroke` + `strokeAlignment:"inner"` → `border border-line` + `box-border`
- アートボードの固定高さ（`height: 900` など）は実装に持ち込まず `h-dvh`
