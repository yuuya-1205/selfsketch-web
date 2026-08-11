import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { store } from "./lib/store";
import { RepositoryProvider } from "@/presentation/di/RepositoryProvider";
import { authRepository } from "@/data/repository/authRepositoryImpl";
import { todayRepository } from "@/data/repository/todayRepositoryImpl";
import { habitsRepository } from "@/data/repository/habitsRepositoryImpl";
import { streakRepository } from "@/data/repository/streakRepositoryImpl";
import { journalRepository } from "@/data/repository/journalRepositoryImpl";
import { galleryRepository } from "@/data/repository/galleryRepositoryImpl";
import { futureRepository } from "@/data/repository/futureRepositoryImpl";
import { insightsRepository } from "@/data/repository/insightsRepositoryImpl";
import { notificationsRepository } from "@/data/repository/notificationsRepositoryImpl";
import { socialRepository } from "@/data/repository/socialRepositoryImpl";
import { settingsRepository } from "@/data/repository/settingsRepositoryImpl";
import { billingRepository } from "@/data/repository/billingRepositoryImpl";
import "./app.css";

/** 依存の配線はここだけ。画面は useRepositories() 越しにしか触らない */
const repositories = {
  auth: authRepository,
  today: todayRepository,
  habits: habitsRepository,
  streak: streakRepository,
  journal: journalRepository,
  gallery: galleryRepository,
  future: futureRepository,
  insights: insightsRepository,
  notifications: notificationsRepository,
  social: socialRepository,
  settings: settingsRepository,
  billing: billingRepository,
};

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
      <RepositoryProvider repositories={repositories}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </RepositoryProvider>
    </Provider>
  </StrictMode>,
);
