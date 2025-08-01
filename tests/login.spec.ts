import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import TestData from "../data/testData.json";
import { DashboardPage } from "../pages/dashboardPage";

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.visit();
});

test("TC-7 Verificar inicio de sesión exitoso", async ({ page }) => {
  await loginPage.fillAndSubmitForm(TestData.usuario[0]);
  await expect(page.getByText("Inicio de sesión exitoso")).toBeVisible();
  dashboardPage = new DashboardPage(page);
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});
