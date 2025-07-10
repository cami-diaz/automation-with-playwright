import { test, expect } from "@playwright/test";

test("mi primer test", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);
});
