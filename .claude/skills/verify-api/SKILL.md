---
name: verify-api
description: selfsketch-web の backend（Go + Gin）を実際に起動して API の動作を確認する手順。go run でのサーバー起動、MySQL のローカル起動、curl でのエンドポイント確認、レスポンス形式の検証、frontend（Vite）からの疎通と CORS / プロキシ設定。「API を確認して」「エンドポイントを叩いて」「バックエンドを起動して」「フロントから繋がるか見て」など backend の動作検証が必要な作業では必ずこのスキルに従うこと。
---

# API 検証の手順

`verify-ui` の backend 版。実装したエンドポイントは**必ず一度は起動して叩く**こと。
SQL の間違いは `go test ./...`（DB なしで走る）では見つからない。

## MySQL のローカル起動

リポジトリに compose ファイルはまだない。Docker で単発起動する:

```bash
docker run -d --name selfsketch-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=selfsketch \
  -p 3306:3306 \
  mysql:8 --character-set-server=utf8mb4 --collation-server=utf8mb4_0900_ai_ci
```

- 起動完了までは数十秒かかる。`docker logs selfsketch-mysql 2>&1 | grep "ready for connections"` で待つ
- 3306 が他プロジェクトで埋まっていることがある。`lsof -i :3306` で確認し、埋まっていたら `-p 3307:3306`
- マイグレーション適用:

```bash
cd backend
for f in migrations/*.up.sql; do
  docker exec -i selfsketch-mysql mysql -uroot -proot selfsketch < "$f"
done
```

## サーバー起動

```bash
cd backend
export MYSQL_DSN='root:root@tcp(127.0.0.1:3306)/selfsketch?parseTime=true&loc=UTC&charset=utf8mb4'
go run ./cmd/server &        # -> http://localhost:8080
```

- `PORT` 環境変数でポートを変えられる（既定 8080）
- **`parseTime=true&loc=UTC` を DSN から落とさない**。落とすと DATETIME が `[]byte` で返り、
  Scan が「unsupported Scan」で落ちるか、ローカルタイム解釈で日付がずれる
- 疎通確認: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/healthz` → `200`

## エンドポイントを叩く

`curl -s` + `jq` を基本にする。`-i` でヘッダも見る。

```bash
curl -s http://localhost:8080/api/v1/habits | jq
curl -s -i http://localhost:8080/api/v1/habits/does-not-exist    # 404 とエラー形式の確認
curl -s -X POST http://localhost:8080/api/v1/habits \
  -H 'Content-Type: application/json' \
  -d '{"title":"朝のストレッチ","slot":"morning"}' | jq
```

## 確認ポイント（実装ごとに必ず全部見る）

1. **ステータスコード** — 作成は 201、削除は 204、見つからないは 404
2. **日時が RFC 3339 の UTC か** — `"2026-04-22T07:15:00Z"`。
   `+09:00` が付いていたら DSN の `loc=UTC` かカラム型（`TIMESTAMP` になっている）を疑う
3. **空の一覧が `[]` であること** — `{"data":null}` になっていたら nil スライスの詰め替え漏れ
4. **JSON のキーが lowerCamelCase か** — struct タグの付け忘れは Go のフィールド名（`CreatedAt`）がそのまま出る
5. **enum が snake_case の英字か** — 日本語ラベルが漏れていないか
6. **エラーの形** — `{"error":{"code":"...","message":"..."}}`。
   `code` が機械可読な固定文字列か、`message` に SQL やスタックが漏れていないか
7. **日本語が化けていないか** — `charset=utf8mb4` とテーブルの照合順序を確認
8. **サーバーログ** — Gin のアクセスログに 500 が出ていないか。`go run` の標準出力を確認する

## frontend からの疎通

`frontend/apps/web/vite.config.ts` には**プロキシ設定がまだない**（`analysis/frontend` にはある）。
web から Go の API を叩くには次のどちらかが要る。

**推奨: Vite の dev プロキシを足す**（同一オリジンになるので CORS 設定が不要になる）

```ts
// frontend/apps/web/vite.config.ts
server: {
  proxy: {
    "/api": "http://localhost:8080",
  },
},
```

**代替: Go 側に CORS ミドルウェアを入れる**
`gin-contrib/cors` を使い、許可オリジンは環境変数で渡す（`*` を本番にそのまま出さない）。
Cookie 認証にする場合は `AllowCredentials: true` が必要で、そのとき `*` は使えない。

疎通確認:

```bash
curl -s http://localhost:5173/api/v1/habits | jq   # Vite 経由（プロキシを足した場合）
```

- ⚠️ この設定変更は frontend の差分なので、**backend の PR に混ぜない**（`split-work`）

## 片付け

```bash
kill %1                                    # go run を止める
docker stop selfsketch-mysql && docker rm selfsketch-mysql
```

- 検証用のリクエストで作ったデータは残しっぱなしにしない（コンテナごと消せば済む）
- 検証に使った `.sh` / `.http` はスクラッチパッドに置き、リポジトリにコミットしない
