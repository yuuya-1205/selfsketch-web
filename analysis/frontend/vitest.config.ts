import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

// vite.config.ts（alias / plugins）をそのまま引き継いでテスト設定だけ足す。
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: false,
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
      css: false,
    },
  }),
);
