---
name: backend-conventions
description: selfsketch-web の backend（Go + Gin、クリーンアーキテクチャ、MySQL）の共通規約。レイヤ構成と依存の向き、パッケージ配置、API のレスポンス形式（日時・金額・enum・エラー・ページネーション）、Go のコード規約。「backend を触る」「Go のコードを書く」「API を実装する」「レイヤ構成を知りたい」など backend/ 配下のファイルに触れる作業では必ずこのスキルに従うこと。
---

# backend の共通規約

Go 1.25 + Gin。module は `github.com/yuuya-1205/selfsketch-web/backend`。
エンドポイントを 1 本足す具体的な手順は `add-endpoint`、テストの書き方は `backend-testing`、
起動して叩く手順は `verify-api` を参照。

## レイヤ構成（クリーンアーキテクチャ）

```
backend/
├── cmd/server/main.go              エントリポイント。DI（依存の配線）はここだけ
├── migrations/                     golang-migrate 用の .sql（NNNN_名前.up.sql / .down.sql）
└── internal/
    ├── domain/                     エンティティ + リポジトリ interface + ドメインエラー
    ├── usecase/                    アプリケーションロジック。domain だけに依存
    ├── adapter/
    │   ├── handler/                Gin ハンドラ + ルーティング + リクエスト/レスポンス DTO
    │   └── gateway/mysql/          domain のリポジトリ interface の MySQL 実装
    └── infra/
        ├── config/                 環境変数の読み取り
        └── mysql/                  *sql.DB の生成・接続設定
```

**依存の向きは常に内側（domain）へ。**

```
handler ──> usecase ──> domain <── gateway/mysql
                                       │
                                       └──> infra/mysql
```

- `domain` は **何もインポートしない**（標準ライブラリの `time` / `errors` まで）。
  Gin も database/sql も MySQL ドライバも `domain` からは見えない
- `usecase` は `domain` のみ。`*gin.Context` を引数に取らない。第 1 引数は必ず `context.Context`
- `handler` は HTTP ⇄ usecase の変換だけ。SQL もビジネスルールも書かない
- `gateway/mysql` は `domain` の interface を実装する。**interface の定義は domain 側に置く**
  （利用側がインターフェースを持つ = 依存性逆転。実装側に置くと向きが逆転する）

> 現状 `internal/api/router.go` に `/healthz` と `/api/v1/ping` が直書きされている。
> 最初のリソースを実装するときに `internal/adapter/handler` へ移し、`internal/api` は消す。
> この移動は**単独コミット**にする（`split-work`）。

## パッケージと命名

- パッケージ名は単数形の小文字（`habit` ではなくレイヤ名 `usecase` / `handler`）。
  リソースごとにパッケージを割らず、**レイヤの中でファイルを分ける**（`usecase/habit.go`）
- 公開する構造体は `New` コンストラクタ経由で作る。フィールドは非公開にして interface を受け取る
- インターフェース名に `I` 接頭辞や `Interface` 接尾辞を付けない。`HabitRepository` でよい
- コメントは日本語。`// NewRouter は API のルーティングを組み立てる。` のように主語から書く（既存 `router.go` の流儀）

## API のレスポンス規約

`docs/api-contract.md` の合意事項。**API は生データを返し、整形はフロントエンドが行う。**

| 種類 | 形式 | 例 |
| --- | --- | --- |
| 日時 | RFC 3339 の UTC 文字列 | `"2026-04-22T07:15:00Z"` |
| 金額 | 最小通貨単位の整数 + 通貨コード | `{"amount": 980, "currency": "JPY"}` |
| 列挙値 | 英小文字のスネークケース | `"before_sleep"`, `"paid"` |
| 相対時刻・曜日ラベル | **返さない**（クライアントが算出する） | — |

- JSON のキーは **lowerCamelCase**（フロントの型がそのまま受けられる）。struct タグで明示する
- ページネーションはカーソル方式。`?limit=50&cursor=<opaque>` →
  `{"data": [...], "nextCursor": "..." | null}`。最後のページは `nextCursor: null`
- `dashboard/today` だけは意図的に集約エンドポイント（BFF 的）。それ以外はリソース単位を守る

### エラー

```json
{ "error": { "code": "habit_not_found", "message": "habit id=xxx が見つからない" } }
```

- `code` は機械可読な固定文字列（snake_case）。フロントはこれを見てユーザー向け文言を引く
- `message` は**開発者向け**。ユーザーに直接出す文言を入れない
- ドメインエラーは `domain/errors.go` にセンチネルとして定義し、**HTTP ステータスへの変換は handler 側**で行う。
  usecase から `*gin.Context` や HTTP ステータスを触らない

```go
// domain/errors.go
var (
    ErrNotFound = errors.New("見つからない")
    ErrConflict = errors.New("競合している")
    ErrInvalid  = errors.New("入力が不正")
)
```

## エラーハンドリング

- エラーは握りつぶさない。文脈を足して包む: `fmt.Errorf("habit の取得に失敗: %w", err)`
- 判定は `errors.Is` / `errors.As`。文字列比較しない
- `panic` を使わない（Gin の Recovery に頼るのは想定外の事態だけ）
- ハンドラでは**内部エラーの中身をレスポンスに漏らさない**。500 のときは `message` を固定文言にしてログに詳細を出す

## context

- usecase / repository の第 1 引数は必ず `context.Context`
- handler では `c.Request.Context()` を渡す（`c` そのものを下の層に渡さない）
- MySQL アクセスは `QueryContext` / `ExecContext` / `QueryRowContext` を使う。context なし版は禁止

## MySQL

- ドライバは `github.com/go-sql-driver/mysql`、アクセスは `database/sql` に手書き SQL。
  DSN は環境変数 `MYSQL_DSN`（`infra/config` が読む）
- **DSN には `parseTime=true&loc=UTC&charset=utf8mb4` を必ず付ける**。
  付けないと DATETIME が `[]byte` で返り、ローカルタイムで解釈されて日付がずれる
- カラムは `DATETIME(3)` に **UTC で保存**する。`TIMESTAMP` は使わない（サーバのタイムゾーン設定に依存するため）
- 文字セットは `utf8mb4` / 照合順序は `utf8mb4_0900_ai_ci`
- `Rows` は必ず `defer rows.Close()` し、ループ後に `rows.Err()` をチェックする
- プレースホルダは `?`。**文字列連結で SQL を組み立てない**
- マイグレーションは `backend/migrations/` に `0001_create_habits.up.sql` / `.down.sql` の対で置く。
  down が書けない変更は分割して書けるようにする

## コマンド（変更後は必ず全部通す）

```bash
cd backend
gofmt -l .                 # 出力が空なら整形済み
go build ./...
go vet ./...
go test ./...
```

CI の backend ジョブと同じ内容。`gofmt` は自動整形なので**単独コミット**にする。

## Git

`split-work` スキルに従う。backend の PR に frontend の変更を混ぜない（CI が別ジョブなのと同じ切り方）。
着手前に分割計画を出してユーザーに確認すること。
