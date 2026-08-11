import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/usecase/auth";
import { AuthSplash } from "@/features/auth/components/AuthSplash";

export interface RequireAuthProps {
  /** 未ログインのときの行き先。オンボーディングは /welcome から始めさせる */
  redirectTo?: string;
}

/** ログインしていないと入れないルートをまとめて包む */
export function RequireAuth({ redirectTo = "/login" }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthSplash />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        // ログインしたら元のページへ戻せるように覚えておく
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}
