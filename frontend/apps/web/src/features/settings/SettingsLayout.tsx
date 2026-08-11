import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { Card, CardLabel, Skeleton, SkeletonGroup, cn } from "@selfsketch/ui";
import { SETTINGS_NAV } from "@/presentation/constants/settings";

export function SettingsLayout({
  subtitle,
  children,
}: {
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h2 className="text-[26px] leading-none font-bold text-ink">設定</h2>
        <p className="text-xs font-medium text-muted">{subtitle}</p>
      </header>

      <div className="flex w-full flex-1 flex-col gap-5 lg:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto lg:w-[210px] lg:flex-col">
          {SETTINGS_NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end
              className={({ isActive }) =>
                cn(
                  "shrink-0 rounded-[10px] px-3 py-2.5 text-[13px] transition-colors",
                  isActive
                    ? "border border-line-strong bg-surface font-bold text-ink"
                    : "font-medium text-brown hover:bg-surface",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-3.5">{children}</div>
      </div>
    </>
  );
}

export function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3 p-4.5">
      <CardLabel>{title}</CardLabel>
      {children}
    </Card>
  );
}

export function SettingsRow({
  label,
  description,
  control,
}: {
  label: string;
  description?: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        {description && (
          <span className="text-[11px] text-muted">{description}</span>
        )}
      </span>
      {control}
    </div>
  );
}

/**
 * 設定タブ共通の読み込み中表示。
 * 左のタブナビは即座に出したいので SettingsLayout ごと使い、
 * 右のパネルだけをプレースホルダに差し替える。
 */
export function SettingsPaneSkeleton({ subtitle }: { subtitle: string }) {
  return (
    <SettingsLayout subtitle={subtitle}>
      <SkeletonGroup label="設定を読み込み中" className="gap-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </SkeletonGroup>
    </SettingsLayout>
  );
}
