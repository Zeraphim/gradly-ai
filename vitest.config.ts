import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["tests/research/**/*.test.ts"],
    environment: "node",
    globalSetup: ["tests/research/papers-setup.ts"],
    // The fs module cache keeps an expanded import.meta.glob, so a new prepared
    // study in apps/web/src/research/studies/data/ would be missed until cleared.
    fsModuleCache: false,
  },
});
