---
name: arch
description: selfsketch-web の frontend（React + Redux Toolkit）のクリーンアーキテクチャ。Presentation / UseCase / Domain / Data の層の切り方、Repository 層の責務、RTK Query を DataSource として包む方法、DTO からドメインモデルへの変換、DI とテスト戦略。「画面を追加する」「API に繋ぐ」「Repository を作る」「データ取得を実装する」「層はどこに置く」など frontend/apps 配下でデータが絡む実装をするときは必ずこのスキルに従うこと。backend 側の層構成は backend-conventions を参照。
---

# frontend のレイヤ構成（クリーンアーキテクチャ）

backend（`backend-conventions`）と**同じ語彙・同じ依存の向き**で揃える。
名前だけ揃えて中身が違うと読み替えのコストが増えるので、対応表を先に置く。

| backend | frontend | 役割 |
| --- | --- | --- |
| `adapter/handler` | `presentation/` | 入出力の変換だけ。ここでは HTTP ではなく DOM とイベント |
| `usecase/` | `usecase/` | アプリケーションロジック。`domain` だけに依存 |
| `domain/` | `domain/` | エンティティ + Repository の interface + ドメインエラー |
| `adapter/gateway/mysql` | `data/repository/` | `domain` の interface を実装する |
| `infra/mysql` | `data/datasource/` | 外の世界との接続。ここでは HTTP（RTK Query）と localStorage |
| `cmd/server/main.go` | `main.tsx` | DI（依存の配線）はここだけ |

## ディレクトリ

```
apps/web/src/
├── main.tsx                    DI。本番の Repository 実装を Provider に渡す
├── presentation/
│   ├── features/<機能名>/       画面（Page / Modal）とその子コンポーネント
│   ├── components/layout/      AppShell / Sidebar / Topbar
│   └── store/                  Redux ストアと UI 状態の slice
├── usecase/                    機能ごとに 1 ファイル（usecase/today.ts）
├── domain/
│   ├── model/                  エンティティ。純粋な型と、型に属する計算だけ
│   ├── repository/             Repository の interface（実装は置かない）
│   └── error.ts                ドメインエラー
└── data/
    ├── datasource/             RTK Query の endpoint。DTO を返す
    ├── dto/                    API のレスポンス型（サーバの形そのまま）
    ├── mapper/                 DTO ⇄ ドメインモデルの変換
    └── repository/             domain/repository の実装
```

**依存の向きは常に内側（domain）へ。**

```
presentation ──> usecase ──> domain <── data/repository
                                            │
                                            └──> data/datasource ──> data/dto
```

## 層ごとの規則

### domain — 何にも依存しない

- **React も Redux も RTK Query も import しない。** `@reduxjs/toolkit` が出てきたら層を間違えている
- エンティティは「アプリにとっての意味」で持つ。API の形でも表示の形でもない
  - 日時は `Date`（`"4月22日(火)"` のような整形済み文字列を持たない）
  - 金額は `Money { amount: number; currency: string }`（`"¥980"` を持たない）
  - 状態は union（`"paid" | "refunded"`。`"お支払い済み"` を持たない）
- 型に属する計算はここに置く（例: `completionRate(dashboard)`）。画面で毎回書かない
- **Repository の interface は `domain/repository/` に置く。** `data` 側に置くと依存の向きが逆転する
  （backend で「interface の定義は domain 側」としているのと同じ理由）

```ts
// domain/model/habit.ts
export type HabitSlot =
  | "morning" | "after_wake" | "noon" | "afternoon" | "night" | "before_sleep";

export interface Habit {
  id: string;
  title: string;
  done: boolean;
  slot: HabitSlot;
  /** 完了した時刻。未完了なら null */
  completedAt: Date | null;
}

// domain/repository/todayRepository.ts
import type { TodayDashboard } from "@/domain/model/today";

export interface TodayRepository {
  getDashboard(): Promise<TodayDashboard>;
  toggleHabit(id: string, done: boolean): Promise<void>;
}
```

### data — 外の世界を domain の言葉に翻訳する

`docs/api-contract.md` の「**API は生データを返し、整形はフロントエンドが行う**」を
実際に果たすのがこの層。翻訳をここに閉じ込めるから、上の層は API の都合を知らずに済む。

- `dto/` は**サーバのレスポンスそのまま**の型。RFC 3339 の文字列、最小通貨単位の整数、snake_case の enum
- `mapper/` が DTO → ドメインモデルに変換する。`new Date(dto.completedAt)` はここでだけ書く
- `datasource/` は RTK Query の endpoint。**DTO を返す**（ドメインモデルを返さない）
- `repository/` が datasource を呼び、mapper を通し、エラーを正規化して返す

```ts
// data/datasource/todayDataSource.ts
export const todayDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    todayDashboard: build.query<TodayDashboardDto, void>({
      query: () => "/dashboard/today",
      providesTags: ["Today"],
    }),
  }),
});

// data/mapper/todayMapper.ts
export function toHabit(dto: HabitDto): Habit {
  return {
    id: dto.id,
    title: dto.title,
    done: dto.done,
    slot: dto.slot,
    completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
  };
}
```

#### Repository は「フックを返す」形にする

React のフックのルール上、RTK Query のフックはコンポーネントの本体でしか呼べない。
そのため Repository の**読み取り側はフックとして公開**し、書き込み側は関数にする。
interface は `domain` に置いたまま、実装がフックを提供する形にする。

```ts
// domain/repository/todayRepository.ts
export interface TodayRepository {
  /** 読み取りはフック。呼び出し側はコンポーネント本体で使う */
  useDashboard(): RepositoryResult<TodayDashboard>;
  useToggleHabit(): (id: string, done: boolean) => Promise<void>;
}

/** 全 Repository 共通の読み取り結果。画面はこの形だけを知っていればよい */
export interface RepositoryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: DomainError | null;
}
```

```ts
// data/repository/todayRepositoryImpl.ts
export const todayRepository: TodayRepository = {
  useDashboard() {
    const { data, isLoading, error } = todayDataSource.useTodayDashboardQuery();
    return {
      data: data && toTodayDashboard(data),
      isLoading,
      error: toDomainError(error),
    };
  },
  // ...
};
```

- **`useMemo` で包む必要はない**。`toTodayDashboard` は純粋関数で、RTK Query の `data` は
  参照が安定している（同じキャッシュなら同じ参照）ため、変換は再レンダーごとに走ってよい。
  重い変換（1000 件超のリストなど）が出てきたら、そのときだけ `useMemo` を足す

### usecase — アプリケーションのルール

- `domain` だけに依存する。**`data` を import しない**（Repository は interface 越しに受け取る）
- 「画面に出す値をどう決めるか」がここ。複数 Repository をまたぐ調整もここ
- 表示用の文字列を作るのもここでよい（`"4月22日(火)"` を作るのは usecase か presentation。
  **domain には持ち込まない**）

```ts
// usecase/today.ts
export function useTodayDashboard() {
  const { data, isLoading, error } = useRepositories().today.useDashboard();
  return {
    dashboard: data,
    isLoading,
    error,
    completionRate: data ? completionRate(data) : 0,
  };
}
```

### presentation — DOM とイベントの変換だけ

- **`data/` を import しない。** `usecase` 経由でだけデータに触る。
  `import { ... } from "@/data/..."` が画面に出てきたら層を跨いでいる
- サーバー由来のデータを `useState` に写さない（Repository のキャッシュが正）。
  フォームの下書きのような**画面固有の状態**だけ `useState` / UI slice に置く
- ローディングとエラーの分岐はここが持つ。`Skeleton` / `SkeletonGroup` を使う

## DI（依存の配線）

backend が `cmd/server/main.go` だけで配線するのと同じで、**`main.tsx` だけ**で配線する。
テストで実装を差し替えられるようにするため、Repository は Context 経由で渡す。

```tsx
// main.tsx
<RepositoryProvider value={{ today: todayRepository, habits: habitsRepository }}>
  <App />
</RepositoryProvider>
```

```ts
// presentation/di/useRepositories.ts
export function useRepositories(): Repositories {
  const repos = use(RepositoryContext);
  if (!repos) throw new Error("RepositoryProvider の外では使えません");
  return repos;
}
```

- **Repository を直接 import しない。** 必ず `useRepositories()` から取る。
  直接 import するとテストで差し替えられなくなる

## エラー

backend は `{ error: { code, message } }` を返す（`backend-conventions`）。
`code` は機械可読、`message` は開発者向けでユーザーに出すものではない。

- `data/repository` が `toDomainError()` で `DomainError` に正規化する。
  **RTK Query の `FetchBaseQueryError` を上の層に漏らさない**
- ユーザー向けの文言は `presentation` が `code` から引く。`message` をそのまま画面に出さない

```ts
// domain/error.ts
export type DomainErrorCode =
  | "not_found" | "conflict" | "invalid" | "unauthorized" | "network" | "unknown";

export interface DomainError {
  code: DomainErrorCode;
  /** 開発者向け。画面には出さない */
  detail: string;
}
```

## テスト

層ごとにテストの重さが変わる。**内側ほど軽く、外側ほど少なく**。

| 層 | テスト対象 | 道具 |
| --- | --- | --- |
| `domain` | 型に属する計算 | 素の Vitest。React 不要 |
| `data/mapper` | DTO の固定値 → ドメインモデル | 素の Vitest。**ここが一番費用対効果が高い** |
| `usecase` | Repository をフェイクにしてロジック | `renderHook` + フェイク Repository |
| `presentation` | 表示とイベント | `render` + `RepositoryProvider` にフェイクを差す |
| `data/datasource` | **書かない** | RTK Query の動作確認になるだけ |

- マッパーのテストは**必ず書く**。日時のタイムゾーン、金額の単位、enum の取りこぼしは
  ここでしか捕まえられず、落ちると画面全体が壊れる
- フェイク Repository は `RepositoryResult` を返すだけの素のオブジェクトでよい。
  モックライブラリを持ち込まない

## いま（2026年8月時点）の状態と移行手順

現状は `lib/api/` に DTO もモックもフックも同居していて、層が分かれていない。
RTK Query への移行は済んでいる（`baseApi` + `injectEndpoints`）ので、**それを
`data/datasource` として温存したまま**、外側から順に剥がす。

1. `domain/model` を作り、`lib/api/types.ts` から**生データの型だけ**を移す
   （`"完了済 · 7:15"` のような整形済みフィールドは持ち込まない。`docs/api-contract.md` 参照）
2. `data/dto` に現在の型を移し、`data/mapper` で DTO → domain の変換を書く（**テストも同時に**）
3. `domain/repository` に interface、`data/repository` に実装を置く
4. `usecase` を作り、画面から `lib/api` の import を外す
5. `lib/api` が空になったら消す

**1 機能ずつ縦に移す。**「全機能の domain を作る」→「全機能の data を作る」と横に割ると、
途中の状態で画面が動かなくなる。`split-work` の「工程ごとに割らない」と同じ理由。

## やってはいけない

- `presentation` から `data/` を import する（`usecase` を経由する）
- `domain` に React / Redux / RTK Query の型が出てくる
- Repository の interface を `data/` 側に定義する（依存の向きが逆転する）
- Repository を直接 import する（`useRepositories()` を使う。テストで差し替えられなくなる）
- DTO をそのまま画面まで流す（マッパーを通す。API の変更が画面まで波及する）
- 層を増やすためだけに usecase を素通しで書く（ロジックが無いなら
  Repository のフックを presentation で直接使ってよい。**ただし import は usecase 越しに再 export する**）
