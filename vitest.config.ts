import { defineConfig } from "vitest/config";
export default defineConfig({
  test: { include: ["tests/research/**/*.test.ts"], environment: "node" },
});
