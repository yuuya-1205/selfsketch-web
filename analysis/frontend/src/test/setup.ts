// jest-dom のマッチャ（toBeInTheDocument など）を vitest の expect に登録する。
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
