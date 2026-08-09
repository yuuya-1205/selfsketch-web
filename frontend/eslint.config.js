import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";

/**
 * frontend モノレポ全体（apps/web, apps/admin, packages/ui）の flat config。
 * 型情報を使う lint は tsc --noEmit と役割が重複するため入れていない。
 */
export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/*.tsbuildinfo",
      "deploy/**",
    ],
  },

  // 設定ファイル（Node 実行）
  {
    files: ["*.js", "*.ts", "**/vite.config.ts", "vitest.config.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // アプリ / パッケージのソース
  {
    files: ["apps/*/src/**/*.{ts,tsx}", "packages/*/src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,

  {
    files: ["apps/*/src/**/*.{ts,tsx}", "packages/*/src/**/*.{ts,tsx}"],
    plugins: { "react-refresh": reactRefresh },
    rules: {
      // Vite の Fast Refresh は「コンポーネントだけを export するファイル」を前提にする。
      // 既存コードは定数やヘルパーを同居させている箇所があるので warn に留める。
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  // テストファイル
  {
    files: ["**/*.test.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // Prettier と競合する整形系ルールを最後に無効化する
  prettier,
);
