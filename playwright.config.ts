import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 0,
  fullyParallel: true,
  reporter: "html",
  use: {
    headless: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "Setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "Chromium",
      use: {
        browserName: "chromium",
        ...devices["Desktop Chrome"],
      },
      dependencies: ["Setup"],
    },
    // {
    //   name: "Firefox",
    //   use: {
    //     browserName: "firefox",
    //     ...devices["Desktop Firefox"],
    //   },
    // },
    // {
    //   name: "WebKit",
    //   use: {
    //     browserName: "webkit",
    //     ...devices["Desktop Safari"],
  ],
});
