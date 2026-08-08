import { Navigate, Route, Routes } from "react-router";
import { AppShell } from "@/components/layout/AppShell";
import { TodayPage } from "@/features/today/TodayPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { NAV_GROUPS } from "@/lib/nav";

/** まだ実装していない画面は共通のプレースホルダに流す */
const PENDING = NAV_GROUPS.flatMap((g) => g.items).filter(
  (i) => i.to !== "/today",
);

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<TodayPage />} />
        {PENDING.map((item) => (
          <Route
            key={item.to}
            path={item.to}
            element={
              <PlaceholderPage title={item.label} crumb={item.groupLabel} />
            }
          />
        ))}
        <Route
          path="*"
          element={<PlaceholderPage title="ページが見つかりません" crumb="" />}
        />
      </Route>
    </Routes>
  );
}
