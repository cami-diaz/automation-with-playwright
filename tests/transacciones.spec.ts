import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboardPage";
import { ModalEnviarTransferencia } from "../pages/modalEnviarTransferencia";
import TestData from "../data/testData.json";

let dashboardPage: DashboardPage;
let modalEnviarTransferencia: ModalEnviarTransferencia;

const testUsuarioEnvia = test.extend({
  storageState: "playwright/.auth/usuarioEnvia.json",
});

const testUsuarioRecibe = test.extend({
  storageState: "playwright/.auth/usuarioRecibe.json",
});

test.beforeEach(async ({ page }) => {
  dashboardPage = new DashboardPage(page);
  await page.goto("http://localhost:3000/dashboard");
  modalEnviarTransferencia = new ModalEnviarTransferencia(page);
});

testUsuarioEnvia("TC-12 Verificar transaccion exitosa", async ({ page }) => {
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  await dashboardPage.botonEnviarDinero.click();
  await modalEnviarTransferencia.completarYhacerClickEnviar(
    TestData.usuario[0].email,
    "100"
  );
  await expect(
    page.getByText("Transferencia enviada a " + TestData.usuario[0].email)
  ).toBeVisible();
});

testUsuarioRecibe(
  "TC-13 Verificar que el usuario recibe la transferencia",
  async ({ page }) => {
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await expect(page.getByText("Transferencia de")).toBeVisible();
  }
);
