import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/lib/api/baseApi";
import { uiReducer } from "./uiSlice";

/**
 * アプリのストア。
 * クライアント状態は slice、サーバー状態は RTK Query（baseApi）が持つ。
 */
export function createStore() {
  return configureStore({
    reducer: {
      ui: uiReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });
}

export const store = createStore();

/** テストでは createStore() で毎回まっさらなストアを作る */
export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
