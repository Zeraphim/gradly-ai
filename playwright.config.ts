import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  timeout: 120000,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:5173", trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev -- --test",
    url: "http://127.0.0.1:5173/api/health",
    timeout: 120000,
    reuseExistingServer: false,
    env: {
      PREVIEW_MODE: "true",
      DEMO_MODE: "true",
      NEBIUS_API_KEY: "",
      DATABASE_URL: "file:.data/e2e.db",
      RESEARCH_ENABLED: "true",
    },
  },
});
