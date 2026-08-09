import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { store } from "./lib/store";
import "./app.css";

/*
 * GitHub Pages の 404 フォールバックから戻ってきた場合、
 * 元のパスを sessionStorage から取り出して履歴に戻す（deploy/404.html 参照）。
 */
const redirected = sessionStorage.getItem("spa:redirect");
if (redirected) {
  sessionStorage.removeItem("spa:redirect");
  window.history.replaceState(null, "", redirected);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
