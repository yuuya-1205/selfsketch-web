# 品質ツール導入メモ

lint / フォーマッタ / テストを導入した際の構成と、**残っている判断待ちの論点**。

## 導入したもの

| 対象 | lint | format | test |
| --- | --- | --- | --- |
| `frontend/` | ESLint 10（flat config, typescript-eslint, react-hooks, react-refresh） | Prettier 3 | Vitest 4 + Testing Library（27 ケース） |
| `backend/` | `go vet` | `gofmt` | `go test`（httptest, 4 テスト / 5 サブケース） |
| `analysis/frontend/` | ESLint 10（同上） | Prettier 3 | Vitest 4 + Testing Library（4 ケース） |
| `analysis/backend/` | Ruff | `ruff format` | pytest + TestClient（5 ケース） |

CI（`.github/workflows/ci.yml`）の 4 ジョブすべてが lint → format → typecheck → test → build を実行する。

## 判断待ち 1: TypeScript が 6 系に落ちている（重要）

**現象**: `frontend/apps/*/package.json` と `packages/ui/package.json` は `typescript: ^7.0.2`
を宣言しているが、実際に `tsc` として解決されるのは **6.0.3**。
`npm ls typescript` は `invalid` と表示する。

**原因**: TypeScript 7 はネイティブ（Go）移植版で、パッケージが公開する API は
`{version, versionMajorMinor}` のみ。JS のコンパイラ API を持たないため
`@typescript-eslint/parser` が読み込み時に例外を投げる（typescript-eslint#10940）。
typescript-eslint を入れると peer 依存として TS 6 が巻き込まれ、
npm の workspaces 構成ではルートに巻き上がって TS 7 を上書きしてしまう。

npm の `overrides` で typescript-eslint 配下にだけ TS 6 をネストする方法も試したが、
npm は peer 依存の入れ子解決を拒否する（`--legacy-peer-deps` でも不可）。

**導入前は TS 7.0.2 でビルドされていた**（コミット済み lockfile で確認）。
つまりこれは lint 導入の副作用による事実上のダウングレードで、意図した変更ではない。

**選択肢**:

| 案 | 内容 | 得るもの / 失うもの |
| --- | --- | --- |
| A | TS 6 を受け入れ、`package.json` の宣言を `^6.0.3` に直す | 宣言と実態が一致する / ネイティブ版の高速なコンパイルを失う |
| B | TS 7 に戻し、typescript-eslint を外す | 高速な TS 7 / ESLint が `.tsx` を解析できなくなる（実質 lint 廃止） |
| C | TS 7 に戻し、lint を oxlint（Rust 製、TS API 非依存）へ置き換える | 両立できる可能性 / ルール構成の作り直しが必要、未検証 |

現状は「宣言は 7、実体は 6」という**どちらでもない状態**なので、いずれかに寄せる必要がある。

## 判断待ち 2: Prettier のバックログ 45 ファイル

導入時点で整形済みだったファイルのみを `format:check` の対象にし、
差分が出る 45 ファイルは `frontend/.prettierignore` に列挙して除外している。
一括整形すると約 1,250 行の差分になりレビュー不能なため。

副作用として、**この 45 ファイルへの新規編集は整形チェックが効かない**。
1 ファイルずつ `.prettierignore` から消して `npx prettier --write <file>` し、
整形専用のコミットとして分けて解消していく想定。

`analysis/frontend` 側は `printWidth: 100` を選ぶことで既存ファイルの差分がゼロになったため、
バックログなしで全ファイルが対象になっている。

## その他の注意点

- **型情報を使う ESLint ルール（`recommendedTypeChecked`）は未導入**。
  `tsc --noEmit` が strict + `noUnusedLocals` / `noUnusedParameters` で回っており重複が大きいため
- **`@testing-library/jest-dom` は不採用**（`frontend/`）。
  マッチャの型拡張が各 workspace の `tsc` プロジェクトから見えず typecheck が落ちるため、
  素の DOM アサーションを使っている
- **`analysis/backend` は `httpx` ではなく `httpx2`**。
  Starlette の TestClient が `httpx` を deprecated 扱いにして警告を出すため
- カバレッジ閾値と pre-commit フックは未導入
