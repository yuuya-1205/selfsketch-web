# selfsketch-web の作業ルール

## このリポジトリについて

目的は学習であるため、アプリの完成は求めていない。

## 現在の段階

- 段階:フェーズ1
- AI がしてよいこと:レビュー
- AI がしてはいけないこと:実装や文章作成（私がやっていいってことはOKとする）

## 作業の手順

- 流れ:

## コミット

- メッセージの形:
- 分け方:
- 禁止:

## PR

- 大きさ:
- 型:

## 資料の場所

- docs/phase1-tasks.md:
- docs/learning-plan.md:

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## そもそもAGENTS.mdは何をするものなのか？

AIが作業を始める度に、毎回自動で読み込まれる。

全体の開発のどの部分で必要で他に必要なものってなんなのか？って点は図解するなりして知りたいかな。

作業の手順は必要だよね。
コミットメッセージとかも必要だよね。
PRの型は確かに必要だよね。
