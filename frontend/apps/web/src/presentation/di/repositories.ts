import { createContext, use } from "react";
import type { AuthRepository } from "@/domain/repository/authRepository";
import type { BillingRepository } from "@/domain/repository/billingRepository";
import type { FutureRepository } from "@/domain/repository/futureRepository";
import type { GalleryRepository } from "@/domain/repository/galleryRepository";
import type { InsightsRepository } from "@/domain/repository/insightsRepository";
import type { HabitsRepository } from "@/domain/repository/habitsRepository";
import type { JournalRepository } from "@/domain/repository/journalRepository";
import type { NotificationsRepository } from "@/domain/repository/notificationsRepository";
import type { SettingsRepository } from "@/domain/repository/settingsRepository";
import type { SocialRepository } from "@/domain/repository/socialRepository";
import type { StreakRepository } from "@/domain/repository/streakRepository";
import type { TodayRepository } from "@/domain/repository/todayRepository";

/**
 * 画面が使える Repository の一覧。機能を移すたびにここへ足す。
 * 型は domain の interface で持つので、presentation は実装を知らない。
 */
export interface Repositories {
  auth: AuthRepository;
  today: TodayRepository;
  habits: HabitsRepository;
  streak: StreakRepository;
  journal: JournalRepository;
  gallery: GalleryRepository;
  future: FutureRepository;
  insights: InsightsRepository;
  notifications: NotificationsRepository;
  social: SocialRepository;
  settings: SettingsRepository;
  billing: BillingRepository;
}

export const RepositoryContext = createContext<Repositories | null>(null);

/**
 * Repository は必ずこれ経由で取る。直接 import するとテストで
 * フェイクに差し替えられなくなる。
 */
export function useRepositories(): Repositories {
  const repositories = use(RepositoryContext);
  if (!repositories) {
    throw new Error("RepositoryProvider の外では使えません");
  }
  return repositories;
}
