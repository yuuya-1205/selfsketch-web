---
name: add-endpoint
description: selfsketch-web の backend（Go + Gin）に新しい API エンドポイント・リソース・ハンドラを追加するときの手順。「〜の API を作って」「エンドポイントを追加」「habits の CRUD を実装」「/api/v1 に〜を生やす」「バックエンドを実装して」など backend/internal 配下に処理を足す作業では必ずこのスキルに従うこと。
---

# エンドポイント追加の手順

レイヤ構成・依存の向き・レスポンス規約は `backend-conventions` を先に読むこと。
このスキルはその上で「1 リソース分を通す」手順。

## 着手前

1. **`docs/api-contract.md` にそのエンドポイントの定義があるか確認する。**
   ない場合は先にドキュメントへ追記して形を決める（パス・メソッド・リクエスト・レスポンス）
2. **フロントが依存する型を確認する** — `frontend/apps/web/src/lib/api/types.ts`。
   ただし現行の型は表示用（`"完了済 · 7:15"` のような整形済み文字列）なので**そのまま返さない**。
   生データに直したうえで、整形はフロント側のマッパーに任せる
3. **`split-work` で分割計画を出してユーザーに確認する。** 目安の割り方:

   | # | コミット |
   | --- | --- |
   | 1 | migration（`.up.sql` / `.down.sql`）とテーブル定義 |
   | 2 | domain（エンティティ + リポジトリ interface + エラー） |
   | 3 | gateway/mysql（リポジトリ実装 + テスト） |
   | 4 | usecase（+ テスト） |
   | 5 | handler + ルーティング登録（+ httptest） |
   | 6 | README / api-contract.md の更新 |

   認証やレイヤの初回移行が絡むときは、その分をさらに別コミットに割る。

## 手順（内側から外側へ）

依存が内向きなので、**domain → usecase → gateway → handler** の順に書くとコンパイルが常に通る。

### 1. domain — エンティティとリポジトリ interface

`internal/domain/habit.go`。外部パッケージをインポートしない。

```go
package domain

import (
	"context"
	"time"
)

// Habit は 1 つの習慣を表す。
type Habit struct {
	ID        string
	Title     string
	Slot      HabitSlot
	Paused    bool
	CreatedAt time.Time // UTC
}

// HabitSlot は習慣を行う時間帯。API では snake_case で表現する。
type HabitSlot string

const (
	SlotMorning     HabitSlot = "morning"
	SlotAfterWake   HabitSlot = "after_wake"
	SlotNoon        HabitSlot = "noon"
	SlotAfternoon   HabitSlot = "afternoon"
	SlotNight       HabitSlot = "night"
	SlotBeforeSleep HabitSlot = "before_sleep"
)

// HabitRepository は習慣の永続化。実装は adapter/gateway/mysql に置く。
type HabitRepository interface {
	List(ctx context.Context, userID string) ([]Habit, error)
	FindByID(ctx context.Context, id string) (Habit, error) // 無ければ ErrNotFound
	Create(ctx context.Context, h Habit) error
}
```

- **interface は利用側（domain）に置く**。gateway 側に定義すると依存の向きが逆転する
- 日本語ラベル（`"毎朝"`）を domain に持ち込まない。表示はフロントの辞書の担当
- 「見つからない」は `domain.ErrNotFound` を返す（`domain/errors.go`）

### 2. usecase — アプリケーションロジック

`internal/usecase/habit.go`。`domain` だけに依存する。`gin` を絶対にインポートしない。

```go
type HabitUsecase struct {
	repo domain.HabitRepository
}

func NewHabitUsecase(repo domain.HabitRepository) *HabitUsecase {
	return &HabitUsecase{repo: repo}
}

func (u *HabitUsecase) List(ctx context.Context, userID string) ([]domain.Habit, error) {
	return u.repo.List(ctx, userID)
}
```

- 受け取るのは interface、返すのは具体型（Go の慣習）
- 単純な委譲だけでも usecase を飛ばさない。認可・集約・トランザクション境界が入る場所を空けておく

### 3. gateway/mysql — リポジトリ実装

`internal/adapter/gateway/mysql/habit.go`。SQL はここにしか書かない。

```go
func (r *HabitRepository) List(ctx context.Context, userID string) ([]domain.Habit, error) {
	const q = `SELECT id, title, slot, paused, created_at
	           FROM habits WHERE user_id = ? ORDER BY created_at`

	rows, err := r.db.QueryContext(ctx, q, userID)
	if err != nil {
		return nil, fmt.Errorf("habits の取得に失敗: %w", err)
	}
	defer rows.Close()

	var habits []domain.Habit
	for rows.Next() {
		var h domain.Habit
		if err := rows.Scan(&h.ID, &h.Title, &h.Slot, &h.Paused, &h.CreatedAt); err != nil {
			return nil, fmt.Errorf("habits の Scan に失敗: %w", err)
		}
		habits = append(habits, h)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("habits の走査に失敗: %w", err)
	}

	return habits, nil
}
```

- `sql.ErrNoRows` は**必ず `domain.ErrNotFound` に変換して返す**。
  `database/sql` のエラーを上の層へ漏らさない（`errors.Is(err, sql.ErrNoRows)` で判定）
- プレースホルダは `?`。文字列連結禁止
- 空の結果は `nil` スライスでよい。ハンドラ側で `[]` に落とす（後述）

### 4. handler — HTTP ⇄ usecase の変換

`internal/adapter/handler/habit.go`。DTO（レスポンス構造体）もここに置く。

```go
// habitResponse は API が返す習慣。JSON のキーは lowerCamelCase。
type habitResponse struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Slot      string `json:"slot"`
	Paused    bool   `json:"paused"`
	CreatedAt string `json:"createdAt"` // RFC 3339 UTC
}

func (h *HabitHandler) List(c *gin.Context) {
	habits, err := h.uc.List(c.Request.Context(), userIDFrom(c))
	if err != nil {
		respondError(c, err)
		return
	}

	// nil スライスは JSON で null になるため、空配列で返す
	res := make([]habitResponse, 0, len(habits))
	for _, hb := range habits {
		res = append(res, newHabitResponse(hb))
	}

	c.JSON(http.StatusOK, gin.H{"data": res})
}
```

- **domain のエンティティをそのまま `c.JSON` に渡さない**。必ず DTO に詰め替える
  （内部フィールドの漏洩防止と、キー名・日時形式の固定のため）
- 時刻は `t.UTC().Format(time.RFC3339)`
- リクエストのバインドは `c.ShouldBindJSON(&req)`。失敗は 400 + `code: "invalid_request"`
- ドメインエラー → HTTP ステータスの変換は `handler/response.go` の共通関数に集約する:
  `ErrNotFound` → 404 / `ErrInvalid` → 400 / `ErrConflict` → 409 / それ以外 → 500（詳細はログのみ）

### 5. ルーティング登録

`internal/adapter/handler/router.go` の `/api/v1` グループに足す。

```go
v1 := r.Group("/api/v1")
{
	habits := v1.Group("/habits")
	{
		habits.GET("", habitHandler.List)
		habits.POST("", habitHandler.Create)
		habits.GET("/:id", habitHandler.Get)
	}
}
```

- パスは `docs/api-contract.md` の設計案どおりに合わせる（勝手に変えない）
- ハンドラ構造体の生成と配線は **`cmd/server/main.go` だけ**で行う。
  `NewRouter` は組み立て済みのハンドラを引数で受け取る（テストからフェイクを差せる形にする）

### 6. マイグレーション

`backend/migrations/0001_create_habits.up.sql` と `.down.sql` を対で追加する。

```sql
CREATE TABLE habits (
  id         CHAR(26)     NOT NULL,
  user_id    CHAR(26)     NOT NULL,
  title      VARCHAR(255) NOT NULL,
  slot       VARCHAR(32)  NOT NULL,
  paused     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at DATETIME(3)  NOT NULL,
  PRIMARY KEY (id),
  KEY idx_habits_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

- 日時は `DATETIME(3)` に UTC 保存（`TIMESTAMP` は使わない）
- 一覧取得の WHERE + ORDER BY に合う複合インデックスを最初から張る

## 仕上げ

- テストを書く（`backend-testing`）。**最低でも handler の httptest と gateway のフェイク差し替え**
- 実際に起動して叩いて確認する（`verify-api`）
- `docs/api-contract.md` を実装に合わせて更新する。設計案と実装がずれたら**ドキュメント側も直す**
- `backend/README.md` のエンドポイント表に行を足す
- チェックを全部通す:

```bash
cd backend && gofmt -l . && go build ./... && go vet ./... && go test ./...
```
