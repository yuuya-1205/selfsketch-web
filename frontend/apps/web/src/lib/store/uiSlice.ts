import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** トップバーに出すパンくずと画面タイトル */
export interface PageMeta {
  crumb: string;
  title: string;
}

export interface UiState {
  pageMeta: PageMeta;
}

const initialState: UiState = {
  pageMeta: { crumb: "", title: "" },
};

/**
 * 画面をまたいで共有するクライアント状態。
 * サーバーから来るデータはここに置かず、RTK Query 側に持たせる。
 */
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    pageMetaSet(state, action: PayloadAction<PageMeta>) {
      state.pageMeta = action.payload;
    },
  },
  selectors: {
    selectPageMeta: (state) => state.pageMeta,
  },
});

export const { pageMetaSet } = uiSlice.actions;
export const { selectPageMeta } = uiSlice.selectors;
export const uiReducer = uiSlice.reducer;
