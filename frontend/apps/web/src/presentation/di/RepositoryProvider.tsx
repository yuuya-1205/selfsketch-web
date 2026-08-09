import type { ReactNode } from "react";
import { RepositoryContext, type Repositories } from "./repositories";

/**
 * 依存の配線。本番の実装は main.tsx が渡し、テストはフェイクを渡す。
 * backend が cmd/server/main.go だけで配線するのと同じ考え方。
 */
export function RepositoryProvider({
  repositories,
  children,
}: {
  repositories: Repositories;
  children: ReactNode;
}) {
  return <RepositoryContext value={repositories}>{children}</RepositoryContext>;
}
