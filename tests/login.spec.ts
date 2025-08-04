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

test("TC-11 Loguearse con nuevo usuario creado por backend", async ({
  page,
  request,
}) => {
  const email =
    TestData.usuario[0].email.split("@")[0] +
    Date.now().toString() +
    "@" +
    TestData.usuario[0].email.split("@")[1];
  const response = await request.post("http://localhost:6007/api/auth/signup", {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    data: {
      firstName: TestData.usuario[0].nombre,
      lastName: TestData.usuario[0].apellido,
      email: email,
      password: TestData.usuario[0].password,
    },
  });
  expect(response.status()).toBe(201);

  const responsePromiseLogin = page.waitForResponse(
    "http://localhost:6007/api/auth/login"
  );
  await loginPage.fillAndSubmitForm({
    email: email,
    password: TestData.usuario[0].password,
  });

  const responseLogin = await responsePromiseLogin;
  const responseBodyLoginJson = await responseLogin.json();

  expect(responseLogin.status()).toBe(200);
  expect(responseBodyLoginJson).toHaveProperty("token");
  expect(typeof responseBodyLoginJson.token).toBe("string");
  expect(responseBodyLoginJson).toHaveProperty("user");
  expect(responseBodyLoginJson.user).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      firstName: TestData.usuario[0].nombre,
      lastName: TestData.usuario[0].apellido,
      email: email,
    })
  );

  await expect(page.getByText("Inicio de sesión exitoso")).toBeVisible();
  dashboardPage = new DashboardPage(page);
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});
