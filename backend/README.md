# selfsketch backend

SelfSketch の API サーバー。Go + [Gin](https://github.com/gin-gonic/gin)。

```bash
go run ./cmd/server        # -> http://localhost:8080
go build ./...
go vet ./...
go test ./...              # internal/api のルーティングテスト（httptest）
gofmt -l .                 # 出力が空なら整形済み
```

| パス | 役割 |
| --- | --- |
| `cmd/server` | エントリポイント（`PORT` 環境変数でポート変更可、既定 8080） |
| `internal/api` | ルーティング。エンドポイントは `/api/v1` 以下に追加する |
| `migrations` | golang-migrate の `.sql`。スキーマ設計は `docs/db-design.md` |

## データベース

MySQL 8.0 以上。スキーマの設計意図とテーブル定義は `docs/db-design.md` を参照。

### 接続文字列

環境変数 `MYSQL_DSN` に渡す。**クエリパラメータを省略しない。**

```
selfsketch:password@tcp(127.0.0.1:3306)/selfsketch?parseTime=true&loc=UTC&charset=utf8mb4&time_zone=%27%2B00%3A00%27
```

| パラメータ | 省略すると |
| --- | --- |
| `parseTime=true` | `DATETIME` が `[]byte` で返り、`time.Time` にスキャンできない |
| `loc=UTC` | 受け取った時刻がローカルタイムとして解釈され、日付がずれる |
| `charset=utf8mb4` | 絵文字を含む本文が壊れる |
| `time_zone='+00:00'` | セッションの TZ がサーバ設定のままになる（`%27%2B00%3A00%27` と URL エンコードする） |

### マイグレーション

[golang-migrate](https://github.com/golang-migrate/migrate) を使う。

```bash
brew install golang-migrate

# 接続先（migrate CLI は mysql:// スキームで渡す）
export MIGRATE_DSN='mysql://selfsketch:password@tcp(127.0.0.1:3306)/selfsketch'

migrate -path ./migrations -database "$MIGRATE_DSN" up        # 最新まで適用
migrate -path ./migrations -database "$MIGRATE_DSN" down 1    # 1 つ戻す
migrate -path ./migrations -database "$MIGRATE_DSN" version   # 現在のバージョン
```

- ファイルは `NNNN_名前.up.sql` と `.down.sql` の対で置く。番号は 4 桁連番
- **1 ファイル 1 ステートメント。** MySQL は DDL がトランザクションで巻き戻らないため、
  複数の DDL を 1 ファイルに入れると途中で失敗したときに手で戻すことになる。
  加えて golang-migrate はファイル全体を 1 回の `Exec` に渡すので、
  複数ステートメントを書くと DSN に `multiStatements=true` が要る
- **`.down.sql` を必ず書く。** 失敗して `Dirty database version` になったら、
  手で状態を戻してから `migrate ... force <version>` でバージョンを合わせる

## エンドポイント

- `GET /healthz` … ヘルスチェック
- `GET /api/v1/ping` … 疎通確認

API の形は `frontend/apps/web/src/lib/api/types.ts`（フロントが依存する型）に合わせて設計する。
