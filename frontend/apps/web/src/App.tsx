import { Navigate, Route, Routes } from "react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

/* オンボーディング（未ログイン） */
import { WelcomePage } from "@/features/onboarding/WelcomePage";
import { GoalPage } from "@/features/onboarding/GoalPage";
import { FutureSelfPage } from "@/features/onboarding/FutureSelfPage";
import { FirstHabitPage } from "@/features/onboarding/FirstHabitPage";

/* 今日 / 習慣 */
import { TodayPage } from "@/features/today/TodayPage";
import { HabitFormModal } from "@/features/today/HabitFormModal";
import { HabitDetailPage } from "@/features/today/HabitDetailPage";

/* 軌跡 */
import { StreakPage } from "@/features/streak/StreakPage";
import { MilestoneModal } from "@/features/streak/MilestoneModal";

/* ジャーナル */
import { JournalPage } from "@/features/journal/JournalPage";
import { JournalEditorPage } from "@/features/journal/JournalEditorPage";

/* ギャラリー */
import { GalleryTimelinePage } from "@/features/gallery/GalleryTimelinePage";
import { GalleryGridPage } from "@/features/gallery/GalleryGridPage";
import { LightboxModal } from "@/features/gallery/LightboxModal";

/* 未来の自分 */
import { VisionBoardPage } from "@/features/future/VisionBoardPage";
import { VisionDetailPage } from "@/features/future/VisionDetailPage";

/* インサイト */
import { InsightsPage } from "@/features/insights/InsightsPage";
import { MonthlyReportPage } from "@/features/insights/MonthlyReportPage";

/* フレンド */
import { FriendsPage } from "@/features/social/FriendsPage";
import { ShareModal } from "@/features/social/ShareModal";

/* 通知・設定・課金 */
import { NotificationsPage } from "@/features/notifications/NotificationsPage";
import { GeneralSettingsPage } from "@/features/settings/GeneralSettingsPage";
import { AccountSettingsPage } from "@/features/settings/AccountSettingsPage";
import { SubscriptionPage } from "@/features/settings/SubscriptionPage";
import { PrivacySettingsPage } from "@/features/settings/PrivacySettingsPage";
import { DataSettingsPage } from "@/features/settings/DataSettingsPage";
import { SettingsPlaceholderPage } from "@/features/settings/SettingsPlaceholderPage";
import { PremiumPage } from "@/features/premium/PremiumPage";

/* リフレクション */
import { ReflectionHubPage } from "@/features/reflection/ReflectionHubPage";
import { DailyReflectionPage } from "@/features/reflection/DailyReflectionPage";
import { ComparisonPage } from "@/features/reflection/ComparisonPage";
import { FutureTimelinePage } from "@/features/reflection/FutureTimelinePage";
import { CenturyPage } from "@/features/reflection/CenturyPage";
import { BackcastPage } from "@/features/reflection/BackcastPage";
import { ReflectionVisionBoardPage } from "@/features/reflection/VisionBoardPage";
import { ClosingPage } from "@/features/reflection/ClosingPage";

export function App() {
  return (
    <Routes>
      {/* ---- 未ログイン（サイドナビなし） ---- */}
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/onboarding/goal" element={<GoalPage />} />
      <Route path="/onboarding/future" element={<FutureSelfPage />} />
      <Route path="/onboarding/first-habit" element={<FirstHabitPage />} />

      {/* ---- ログイン後（アプリシェル） ---- */}
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/today" replace />} />

        <Route path="/today" element={<TodayPage />}>
          <Route path="new" element={<HabitFormModal />} />
        </Route>
        <Route path="/habits/:habitId" element={<HabitDetailPage />} />

        <Route path="/streak" element={<StreakPage />}>
          <Route path="milestone" element={<MilestoneModal />} />
        </Route>

        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/new" element={<JournalEditorPage />} />
        <Route path="/journal/:entryId" element={<JournalPage />} />

        <Route path="/gallery" element={<GalleryTimelinePage />} />
        <Route path="/gallery/grid" element={<GalleryGridPage />}>
          <Route path=":itemId" element={<LightboxModal />} />
        </Route>

        <Route path="/future" element={<VisionBoardPage />} />
        <Route path="/future/:visionId" element={<VisionDetailPage />} />

        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/insights/monthly" element={<MonthlyReportPage />} />

        <Route path="/friends" element={<FriendsPage />}>
          <Route path="share" element={<ShareModal />} />
        </Route>

        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="/settings" element={<GeneralSettingsPage />} />
        <Route path="/settings/account" element={<AccountSettingsPage />} />
        <Route path="/settings/subscription" element={<SubscriptionPage />} />
        <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
        <Route path="/settings/data" element={<DataSettingsPage />} />
        <Route
          path="/settings/help"
          element={<SettingsPlaceholderPage title="ヘルプ" />}
        />

        <Route path="/premium" element={<PremiumPage />} />

        <Route path="/reflection" element={<ReflectionHubPage />} />
        <Route path="/reflection/daily" element={<DailyReflectionPage />} />
        <Route path="/reflection/compare" element={<ComparisonPage />} />
        <Route path="/reflection/timeline" element={<FutureTimelinePage />} />
        <Route path="/reflection/century" element={<CenturyPage />} />
        <Route path="/reflection/backcast" element={<BackcastPage />} />
        <Route
          path="/reflection/vision"
          element={<ReflectionVisionBoardPage />}
        />
        <Route path="/reflection/closing" element={<ClosingPage />} />

        <Route
          path="*"
          element={<PlaceholderPage title="ページが見つかりません" crumb="" />}
        />
      </Route>
    </Routes>
  );
}
