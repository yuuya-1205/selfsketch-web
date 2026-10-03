# selfsketch-web の作業ルール

## このリポジトリについて

目的は学習であるため、アプリの完成は求めていない。

## 現在の段階

- 段階:フェーズ1
- AI がしてよいこと:レビュー
- AI がしてはいけないこと:実装や文章作成（私がやっていいってことはOKとする）

## 作業の手順

- 流れ:phase1-tasks.md の 1 項目ずつ進める。終わったら項目にチェックを付ける

- コミット、push、PR 作成は、私が頼んだときだけ行う

## コミット

### 目的

誰が見てもコミットメッセージを見て変更内容がわかるようにするためにこれがある。

- メッセージの形: feat,fix,docs,test,refactor,ci,chore
- 使い分け:
  - feat: 新しい機能や振る舞いを足す際に使用する
  - fix: 不具合を直す際に使用する
  - docs: ドキュメントを作成、変更を加えた際に使用する
  - test: テストだけを変更した際に使用する
  - refactor: 振る舞いを変えず、テストも変えずに、緑のままコードを整えた際に使用する
  - ci: .github/workflows/に対して実装、修正した際に使用する
  - chore: アプリの振る舞い、テスト、ドキュメントのどれにも当てはまらない雑務を変更する際に使用する
- 分け方:
  - 目的1つで1コミット
  - テストが通った時点で、テストと実装を1コミットにする
  - リファクタは別コミット
- 禁止: 理由は書かない。

## PR

- 大きさ:
- 型:これはまだないから作らないといけないかな。

## 資料の場所

- docs/phase1-tasks.md: フェーズ1にどんなことを行うのか記載している
- docs/learning-plan.md: このプロジェクトを通して学びたいことを記載している

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
