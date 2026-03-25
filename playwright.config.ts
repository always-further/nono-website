import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  workers: process.env.CI ? 2 : undefined,
  webServer: {
    command: process.env.CI
      ? "npm run start:test"
      : "npm run build && npm run start:test",
    url: "http://127.0.0.1:3000",
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
