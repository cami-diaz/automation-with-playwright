import { test as setup, expect, request } from "@playwright/test";
import { BackendUtils } from "../utils/backendUtils";
import TestData from "../data/testData.json";
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/dashboardPage";
import { ModalCrearCuenta } from "../pages/modalCrearCuenta";

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let modalCrearCuenta: ModalCrearCuenta;

const usuarioEnviaAuthFile = "playwright/.auth/usuarioEnvia.json";
const usuarioRecibeAuthFile = "playwright/.auth/usuarioRecibe.json";

setup.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  modalCrearCuenta = new ModalCrearCuenta(page);
  await loginPage.visit();
});

setup("Generar usuario que envia dinero", async ({ page, request }) => {
  const usuarioBackend = await BackendUtils.crearUsuarioPorAPI(
    request,
    TestData.usuario[0]
  );
  const nuevoUsuario = {
    ...usuarioBackend,
    password: usuarioBackend.password,
  };

  await loginPage.fillAndSubmitForm(nuevoUsuario);
  await dashboardPage.hacerClickBotonAgregarCuenta();
  await modalCrearCuenta.seleccionarTipoDeCuenta("Débito");
  await modalCrearCuenta.completarMonto("1000");
  await modalCrearCuenta.botonCrearCuenta.click();
  await expect(page.getByText("Cuenta creada exitosamente")).toBeVisible();
  await page.context().storageState({ path: usuarioEnviaAuthFile });
});

setup("Loguearse con usuario que recibe dinero", async ({ page, request }) => {
  await loginPage.fillAndSubmitForm(TestData.usuario[0]);
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  await page.context().storageState({ path: usuarioRecibeAuthFile });
});
