import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * モノレポ全体のユニットテスト設定。
 * apps/* と packages/* のテストをまとめて 1 プロセスで実行する。
 * `@/` は apps/web の src を指す（各 app の vite.config.ts と同じ規約）。
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./apps/web/src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    restoreMocks: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "apps/*/src/**/*.test.{ts,tsx}",
      "packages/*/src/**/*.test.{ts,tsx}",
    ],
  },
});
