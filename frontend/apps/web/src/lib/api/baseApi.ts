import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * API 境界。いまは中身がモックなので baseQuery は空で、各 endpoint が
 * `queryFn` でモックを返している。
 *
 * 実 API に繋ぐときの手順:
 *   1. `fakeBaseQuery()` を
 *      `fetchBaseQuery({ baseUrl: "/api/v1", credentials: "include" })` に差し替える
 *   2. 各 endpoint の `queryFn: ...` を `query: () => "/today"` の形に置き換える
 *   3. モック定数を消す
 * ページ側（フック以降）は変更不要。
 *
 * endpoint は機能ごとのファイルから `injectEndpoints` で足す。
 * このファイルに endpoint を直接書かない。
 */
export const baseApi = createApi({
  reducerPath: "api",
  // エラー型は実 API と同じにしておく。fetchBaseQuery に差し替えたときに
  // data/mapper/error.ts の toDomainError をそのまま使えるようにするため
  baseQuery: fakeBaseQuery<FetchBaseQueryError>(),
  // 再取得の単位。invalidatesTags / providesTags で使う
  tagTypes: [
    "Auth",
    "Today",
    "Habit",
    "Streak",
    "Journal",
    "Gallery",
    "Vision",
    "Insights",
    "Social",
    "Notification",
    "Settings",
    "Reflection",
  ],
  endpoints: () => ({}),
});

/** モックの応答遅延。実 API 化のときに消す */
export const mockDelay = (ms = 80) => new Promise((r) => setTimeout(r, ms));
