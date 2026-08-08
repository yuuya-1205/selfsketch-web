# selfsketch backend

SelfSketch の API サーバー。Go + [Gin](https://github.com/gin-gonic/gin)。

```bash
go run ./cmd/server        # -> http://localhost:8080
go build ./...
go vet ./...
```

| パス | 役割 |
| --- | --- |
| `cmd/server` | エントリポイント（`PORT` 環境変数でポート変更可、既定 8080） |
| `internal/api` | ルーティング。エンドポイントは `/api/v1` 以下に追加する |

## エンドポイント

- `GET /healthz` … ヘルスチェック
- `GET /api/v1/ping` … 疎通確認

API の形は `frontend/apps/web/src/lib/api/types.ts`（フロントが依存する型）に合わせて設計する。
