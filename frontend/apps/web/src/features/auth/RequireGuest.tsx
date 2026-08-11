import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/usecase/auth";
import { AuthSplash } from "@/features/auth/components/AuthSplash";

/**
 * ログイン済みなら入る意味がないルート（ようこそ・ログイン・新規登録）を包む。
 * オンボーディングが途中のアカウントは続きへ送る。
 */
export function RequireGuest() {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();

  if (isLoading) return <AuthSplash />;

  if (isAuthenticated) {
    return (
      <Navigate
        to={hasCompletedOnboarding ? "/today" : "/onboarding/goal"}
        replace
      />
    );
  }

  return <Outlet />;
}
