import { Navigate, Route, Routes } from "react-router";
import { Card } from "@selfsketch/ui";
import { AdminShell } from "@/components/layout/AdminShell";
import { OverviewPage } from "@/pages/OverviewPage";
import { UsersPage } from "@/pages/UsersPage";
import { UserDetailPage } from "@/pages/UserDetailPage";
import { ModerationPage } from "@/pages/ModerationPage";
import { AiMonitoringPage } from "@/pages/AiMonitoringPage";
import { RevenuePage } from "@/pages/RevenuePage";
import { DeliveryPage } from "@/pages/DeliveryPage";
import { AuditPage } from "@/pages/AuditPage";

export function App() {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        <Route index element={<Navigate to="/overview" replace />} />

        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId" element={<UserDetailPage />} />
        <Route path="/moderation" element={<ModerationPage />} />
        <Route path="/ai" element={<AiMonitoringPage />} />
        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/audit" element={<AuditPage />} />

        {/* 権限・メンバーは監査ログ画面に同居しているので誘導する */}
        <Route path="/members" element={<Navigate to="/audit" replace />} />
        <Route path="/settings" element={<Pending label="設定" />} />
        <Route path="*" element={<Pending label="ページが見つかりません" />} />
      </Route>
    </Routes>
  );
}

function Pending({ label }: { label: string }) {
  return (
    <Card
      tone="surface"
      className="grid flex-1 place-items-center border-dashed p-10 text-center"
    >
      <div className="flex max-w-md flex-col gap-2">
        <p className="text-base font-bold text-ink">{label}</p>
        <p className="text-xs leading-relaxed text-brown">
          未実装。デザインは selfsketch.pen の「Admin Console (Web)」にあります。
        </p>
      </div>
    </Card>
  );
}
