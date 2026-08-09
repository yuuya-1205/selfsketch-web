# API 契約 設計ドラフト

> **ステータス: 提案（未確定）。** 実装前に「決めてほしいこと」の合意が必要。
> 現行の `frontend/apps/web/src/lib/api/types.ts` は全てモックデータ用の型であり、
> そのまま API のレスポンス仕様にはできない（後述）。

## 1. 最初に直すべき前提：現行の型は「表示用」であって「データ」ではない

`types.ts` は UI にそのまま流し込む前提で作られているため、**整形済みの文字列**が多数含まれる。

| 現行フィールド | 実際の値の例 | 問題 |
| --- | --- | --- |
| `Habit.meta` | `"完了済 · 7:15"` | 状態 + 時刻 + 区切り文字が 1 つの文字列に潰れている |
| `TodayDashboard.dateLabel` | `"4月22日(火)"` | ロケール依存。i18n 時に破綻する |
| `JournalEntry.dateLabel` / `timeLabel` | `"4/22"` / `"22:14"` | 同上。ソートも比較もできない |
| `FriendActivity.time` | `"3日前"` | 相対時刻をサーバが焼き込むと、クライアントの時計とズレる |
| `Invoice.amount` | `"¥980"` | 通貨記号込み。金額計算ができない |
| `Invoice.status` | `"お支払い済み"` | 日本語リテラルが型の値になっている |
| `StreakSummary.week` | `boolean[]` | 週の起点（月曜/日曜）が型から読み取れない |

**方針: API は生データを返し、整形はフロントエンドが行う。**

- 日時は全て **ISO 8601 / RFC 3339 の UTC 文字列**（例 `2026-04-22T07:15:00Z`）
- 金額は **最小通貨単位の整数 + 通貨コード**（例 `{ "amount": 980, "currency": "JPY" }`）
- 列挙値は **英小文字のスネークケース**（例 `status: "paid" | "refunded"`）
- 相対時刻（"3日前"）と曜日ラベルはクライアント側で算出する

これに伴い `types.ts` は「API レスポンス型」と「ビュー用に整形した型」に分割し、
両者の間に変換層（マッパー）を置く。UI コンポーネントの変更は不要。

### `HabitSlot` の扱い

現在 `"毎朝" | "起床後" | "昼" | "午後" | "夜" | "就寝前"` と日本語リテラルの union になっている。
API では `morning | after_wake | noon | afternoon | night | before_sleep` とし、
表示ラベルはフロントの辞書に持たせる（i18n の前提条件でもある）。

## 2. エンドポイント設計案

すべて `/api/v1` 配下。認証必須（`/auth/*` と `/healthz` を除く）。

### 習慣

```
GET    /api/v1/habits                    習慣一覧
POST   /api/v1/habits                    作成
GET    /api/v1/habits/:id                詳細（heatmap・notes 含む）
PATCH  /api/v1/habits/:id                更新（タイトル・スロット・一時停止など）
DELETE /api/v1/habits/:id                削除
POST   /api/v1/habits/:id/completions    その日の完了を記録
DELETE /api/v1/habits/:id/completions/:date  完了を取り消し
```

完了の記録を独立リソースにしているのは、`today.ts` の楽観更新（失敗時ロールバック）を
そのまま活かすため。`PATCH habits/:id { done: true }` にすると日付の概念が消えてしまう。

### ダッシュボード・集計

```
GET /api/v1/dashboard/today              今日の画面用の集約レスポンス
GET /api/v1/streak                       軌跡ページ
GET /api/v1/insights?month=2026-04       インサイト
GET /api/v1/insights/monthly/:month      月次レポート
```

`dashboard/today` だけは意図的に集約エンドポイント（BFF 的）にする。
今日の画面は習慣・連続記録・未来の自分・週次達成率を同時に必要とし、
個別に叩くと初回表示で 4 往復してしまうため。

### その他リソース

```
GET/POST/PATCH/DELETE  /api/v1/journal/entries[/:id]
GET                    /api/v1/gallery?from=&to=
POST                   /api/v1/gallery/items          画像アップロード
GET/POST/PATCH         /api/v1/visions[/:id]
GET                    /api/v1/friends
GET                    /api/v1/friends/activities
GET                    /api/v1/notifications
PATCH                  /api/v1/notifications/:id      既読化
GET/PATCH              /api/v1/me                     プロフィール・設定
GET                    /api/v1/me/subscription        プラン・請求履歴
```

### 共通仕様

- **ページネーション**: カーソル方式。`?limit=50&cursor=<opaque>` → `{ "data": [...], "nextCursor": "..." | null }`
  （ジャーナル・ギャラリー・通知・フレンド活動は件数が無制限に増えるため必須）
- **エラー**: HTTP ステータス + `{ "error": { "code": "habit_not_found", "message": "..." } }`
  `code` は機械可読な固定文字列、`message` は開発者向け。ユーザー向け文言はフロントが `code` から引く
- **タイムゾーン**: 「今日」の判定はユーザー設定のタイムゾーンで行う。
  クライアントが `X-Timezone: Asia/Tokyo` を送るか、ユーザー設定に保存するかは要決定

## 3. 認証：選択肢

**これは他の全てを縛るため、最初に決める必要がある。** 現在は完全に未実装。

### 案 A: セッション Cookie（サーバ側セッション）

- HttpOnly + Secure + SameSite の Cookie にセッション ID、実体は Redis / DB
- **利点**: XSS でトークンを抜かれない。サーバ側で即座に失効できる。実装が素直
- **欠点**: 状態を持つのでセッションストアが要る。将来ネイティブアプリを出すとやや不便
- **相性**: 現構成（Web のみ、Go + Gin）には最も素直

### 案 B: JWT（アクセストークン + リフレッシュトークン）

- **利点**: ステートレス。モバイルアプリや外部クライアントを増やしやすい
- **欠点**: 失効が難しい（ブラックリストを持つと結局ステートフル）。
  localStorage に置くと XSS 耐性が落ちるため、結局 Cookie 保存になりがち
- **相性**: 将来ネイティブアプリを出す予定があるなら

### 案 C: 外部 IdP（Auth0 / Firebase Auth / Supabase Auth など）

- **利点**: パスワード保管・リセット・ソーシャルログイン・MFA を自前で持たなくて済む。
  セキュリティ的な地雷を踏みにくく、立ち上がりが最速
- **欠点**: 外部サービス依存とコスト。ユーザーデータの持ち方に制約が出る
- **相性**: 個人開発〜小規模で、認証そのものを作り込みたくないなら

> **私見**: 現状は Web のみ・Go バックエンド・認証を自作する動機が見当たらないため、
> **案 C で立ち上げ、必要になったら移行**するのが総工数として最小になる可能性が高い。
> 自前で持ちたい要件（オフライン運用・データ主権など）があるなら案 A。

## 4. 実 API への移行手順

`client.ts` のコメントにある 2 ステップは、実際にはもう少し段階が要る。

1. **契約を確定**（このドキュメント）＋ 認証方式を決定
2. **バックエンドを実装** — `backend/internal/api/router.go` の `/api/v1` にリソースを追加。
   まず `habits` 1 本を通し、往復の型・エラー・認証を確立する
3. **マッパー層を追加** — `lib/api/` に「API レスポンス型 → 現行のビュー型」の変換を置く。
   この時点では変換元がまだモックでよい。UI は無変更
4. **`useMockQuery` を実クエリに差し替え** — `initialData` を外す。
   ここで**全ページにローディングとエラー表示が必要になる**（現在は分岐が一切ない）。
   共通の `<QueryBoundary>` を用意して各ページを包むのが現実的
5. **モックを削除**

ステップ 4 の作業量が最も大きい。ページ数は web 側だけで 30 以上ある。

## 5. 決めてほしいこと

1. **認証方式**（案 A / B / C） — 他の全ての前提
2. **バックエンドのホスティング先** — GitHub Pages は静的配信のみなので API は別が必要。
   Cloud Run / Fly.io / Render など。DB も併せて決める必要がある
3. **データベース** — 現在まったく選定されていない（`backend/go.mod` に DB ドライバなし）
4. **画像ストレージ** — ギャラリーとスケッチの実画像をどこに置くか（S3 / R2 / Cloud Storage）
5. **将来ネイティブアプリを出す予定があるか** — 認証方式の判断材料
6. **`analysis/` の位置づけ** — 本体 API と DB を共有するのか、別系統のデータ基盤にするのか。
   現状は骨組みのみで、何を集計するかが未定義
