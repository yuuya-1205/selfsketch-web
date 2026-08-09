import { configureStore } from "@reduxjs/toolkit";
import { uiReducer } from "./uiSlice";

/**
 * アプリのストア。
 * クライアント状態は slice、サーバー状態は RTK Query の reducer をここに足していく。
 */
export function createStore() {
  return configureStore({
    reducer: {
      ui: uiReducer,
    },
  });
}

export const store = createStore();

/** テストでは createStore() で毎回まっさらなストアを作る */
export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
