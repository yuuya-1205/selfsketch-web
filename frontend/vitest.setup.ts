import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// 各テスト後に React のマウント済みツリーを破棄する
afterEach(() => {
  cleanup();
});
