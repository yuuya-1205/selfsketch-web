---
name: backend-testing
description: selfsketch-web の backend（Go + Gin）のテストの書き方。httptest によるルーティングテスト、テーブル駆動テスト、usecase のフェイクリポジトリ、MySQL ゲートウェイのテスト方針、日本語のエラーメッセージ。「backend のテストを書いて」「Go のテストを追加」「go test が落ちる」など backend/ 配下の *_test.go に触れる作業では必ずこのスキルに従うこと。
---

# backend のテスト方針

標準の `testing` のみ。testify などのアサーションライブラリは入れない
（既存 `internal/api/router_test.go` の流儀に合わせる）。
レイヤ構成は `backend-conventions` を参照。

## 基本の作法

- ファイルは対象と同じパッケージに `xxx_test.go`。パッケージも同じ（`package usecase`）。
  公開 API だけを試したいときのみ `package usecase_test` にする
- **エラーメッセージは日本語で、`got` / `want` を必ず出す**:
  `t.Errorf("ステータスコード: got %d, want %d", rec.Code, http.StatusOK)`
- 続行不能なら `t.Fatalf`、そうでなければ `t.Errorf`。
  1 回の実行でできるだけ多くの失敗を見せる
- ヘルパー関数の先頭で `t.Helper()` を呼ぶ（失敗行が呼び出し側になる）
- サブテストは `t.Run(名前, func(t *testing.T) { ... })`。名前も日本語でよい
- 時刻を扱うコードは `time.Now()` を直接呼ばず、**時刻を引数か構造体フィールドで注入する**。
  テストでは固定時刻（例 `time.Date(2026, 4, 22, 7, 15, 0, 0, time.UTC)`）を渡す

## レイヤごとの方針

| レイヤ | テスト対象 | 依存の埋め方 |
| --- | --- | --- |
| `domain` | バリデーション・状態遷移などの純粋なロジック | 依存なし。素の単体テスト |
| `usecase` | 分岐・エラー変換・集約 | **フェイクのリポジトリ**を手書きして注入 |
| `handler` | ステータスコード・JSON の形・エラー変換 | フェイクの usecase か、フェイク repo 込みの実 usecase |
| `gateway/mysql` | SQL が意図どおりか | 既定では**書かない**（後述） |

**モックライブラリは使わない。** interface が小さいのでフェイクを手書きするほうが速く読める。

```go
// fakeHabitRepository は domain.HabitRepository のテスト用実装。
type fakeHabitRepository struct {
	habits []domain.Habit
	err    error // 返させたいエラー。nil なら成功
}

func (f *fakeHabitRepository) List(ctx context.Context, userID string) ([]domain.Habit, error) {
	if f.err != nil {
		return nil, f.err
	}
	return f.habits, nil
}
```

## ルーティング / ハンドラのテスト（httptest）

既存 `router_test.go` のヘルパーをそのまま使う。`NewRouter` がハンドラを引数で受け取る形なので、
テストからフェイクを差した状態でルーターを組み立てられる。

```go
func TestMain(m *testing.M) {
	// テスト中は Gin のデバッグログを抑える。
	gin.SetMode(gin.TestMode)
	m.Run()
}

// doRequest は組み立てたルーターに 1 リクエストを流し、レコーダーを返す。
func doRequest(t *testing.T, r *gin.Engine, method, path string, body io.Reader) *httptest.ResponseRecorder {
	t.Helper()

	req := httptest.NewRequest(method, path, body)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	return rec
}
```

ハンドラのテストで必ず確認すること:

1. **ステータスコード**
2. **レスポンスの JSON の形** — キー名（lowerCamelCase）、日時が RFC 3339 UTC か、
   金額が `{amount, currency}` か、enum が snake_case か
3. **空の一覧が `[]` であること**（`null` になっていないか）。nil スライスの取りこぼしはここでしか見つからない
4. **エラーの形** — `{"error": {"code": "...", "message": "..."}}` と `code` の値
5. **エラー時に内部エラーの中身が漏れていないこと**（500 の `message` が固定文言か）

```go
func TestListHabitsReturnsEmptyArray(t *testing.T) {
	r := newTestRouter(&fakeHabitRepository{habits: nil})

	rec := doRequest(t, r, http.MethodGet, "/api/v1/habits", nil)

	if rec.Code != http.StatusOK {
		t.Fatalf("ステータスコード: got %d, want %d", rec.Code, http.StatusOK)
	}
	if got, want := rec.Body.String(), `{"data":[]}`; got != want {
		t.Errorf("レスポンスボディ: got %s, want %s", got, want)
	}
}
```

## テーブル駆動テスト

分岐が複数あるときは必ずテーブル駆動にする。エラー変換のテストが典型:

```go
func TestRespondErrorMapsDomainErrors(t *testing.T) {
	tests := []struct {
		name     string
		err      error
		wantCode int
		wantKey  string
	}{
		{"見つからない", domain.ErrNotFound, http.StatusNotFound, "habit_not_found"},
		{"入力が不正", domain.ErrInvalid, http.StatusBadRequest, "invalid_request"},
		{"競合", domain.ErrConflict, http.StatusConflict, "habit_conflict"},
		{"想定外", errors.New("db 死亡"), http.StatusInternalServerError, "internal_error"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// ...
		})
	}
}
```

- ケース名は日本語でよい。`t.Run` の名前は失敗時にそのまま出る
- ループ変数のキャプチャは Go 1.22 以降なら不要（このリポジトリは 1.25）

## MySQL ゲートウェイのテスト

**既定では実 DB に繋ぐテストを書かない。** `go test ./...` は CI で DB なしに走るため、
繋ぐテストを混ぜると CI が落ちる。

- SQL の正しさは `verify-api` の手順（実際に起動して叩く）で担保する
- どうしても自動テストが要る場合は、**ビルドタグで分離する**:

```go
//go:build integration

package mysql
```

  `go test -tags=integration ./...` でだけ走る。CI の既定コマンドには入れない。
  DSN は環境変数から取り、未設定なら `t.Skip("MYSQL_DSN 未設定のためスキップ")`
- ゲートウェイの分岐（`sql.ErrNoRows` → `domain.ErrNotFound` の変換など）は
  usecase 側のフェイクでカバーできるので、そちらで確認する

## 実行

```bash
cd backend
go test ./...                    # CI と同じ
go test ./internal/usecase -run TestListHabits -v
go test ./... -race              # 並行処理を足したときは必ず
go test ./... -cover
```

- `go vet ./...` もテストの一部だと思うこと（`%d` に文字列を渡すなど CI で落ちる）
- テストの追加は**実装と同じコミット**に入れる（`split-work` の「単体でビルドが通る最小単位」）
