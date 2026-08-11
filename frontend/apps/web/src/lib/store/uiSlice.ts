import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** トップバーに出すパンくずと画面タイトル */
export interface PageMeta {
  crumb: string;
  title: string;
}

export interface UiState {
  pageMeta: PageMeta;
  /** モバイルのナビゲーションドロワーが開いているか（.pen の Mobile Web 390 - ドロワー） */
  drawerOpen: boolean;
}

const initialState: UiState = {
  pageMeta: { crumb: "", title: "" },
  drawerOpen: false,
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
    drawerOpened(state) {
      state.drawerOpen = true;
    },
    drawerClosed(state) {
      state.drawerOpen = false;
    },
  },
  selectors: {
    selectPageMeta: (state) => state.pageMeta,
    selectDrawerOpen: (state) => state.drawerOpen,
  },
});

export const { pageMetaSet, drawerOpened, drawerClosed } = uiSlice.actions;
export const { selectPageMeta, selectDrawerOpen } = uiSlice.selectors;
export const uiReducer = uiSlice.reducer;
