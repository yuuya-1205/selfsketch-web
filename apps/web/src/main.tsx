import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import "./app.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
