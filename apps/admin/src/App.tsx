import { Navigate, Route, Routes } from "react-router";
import { Card } from "@selfsketch/ui";
import { AdminShell } from "@/components/layout/AdminShell";
import { OverviewPage } from "@/pages/OverviewPage";
import { ALL_ADMIN_NAV_ITEMS } from "@/lib/nav";

const PENDING = ALL_ADMIN_NAV_ITEMS.filter((i) => i.to !== "/overview");

export function App() {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        {PENDING.map((item) => (
          <Route
            key={item.to}
            path={item.to}
            element={<Pending label={item.label} />}
          />
        ))}
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
