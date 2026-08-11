import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/usecase/auth";
import { AuthSplash } from "@/features/auth/components/AuthSplash";

/**
 * ログイン済みなら入る意味がないルート（ようこそ・ログイン・新規登録）を包む。
 * オンボーディングが途中のアカウントは続きへ送る。
 *
 * ログインが成功するとセッションの再取得でここが先に再描画されるため、
 * 行き先の判断はログイン画面ではなくこちらが持つ。RequireAuth が覚えた
 * 戻り先（state.from）もここで拾う。
 */
export function RequireGuest() {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthSplash />;

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from;
    return (
      <Navigate
        to={hasCompletedOnboarding ? (from ?? "/today") : "/onboarding/goal"}
        replace
      />
    );
  }

  return <Outlet />;
}
