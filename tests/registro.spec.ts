import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/registerPage";
import TestData from "../data/testData.json";

let registerPage: RegisterPage;

test.beforeEach(async ({ page }) => {
  registerPage = new RegisterPage(page);
  await registerPage.visit();
});

test("TC-1 Verificación de elementos visuales en la página de registro", async ({
  page,
}) => {
  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();
});

test("TC-2 Verificar boton de registro inhabilitado por defecto", async ({
  page,
}) => {
  await expect(registerPage.registerButton).toBeDisabled();
});

test("TC-3 Verificar que el botón de registro se habilita al completar los campos", async ({
  page,
}) => {
  await registerPage.fillForm(TestData.usuario[0]);
  await expect(registerPage.registerButton).toBeEnabled();
});

test("TC-4 Verificar redireccionamiento a la pagina de inicio de sesión al hacer click", async ({
  page,
}) => {
  await registerPage.loginButton.click();
  await expect(page).toHaveURL("http://localhost:3000/login");
});

test("TC-5 Verificar registro exitoso", async ({ page }) => {
  const email =
    TestData.usuario[0].email.split("@")[0] +
    "camilatest" +
    Date.now().toString() +
    "@" +
    TestData.usuario[0].email.split("@")[1];

  const usuarioNuevo = { ...TestData.usuario[0], email };
  await registerPage.fillAndSubmitForm(usuarioNuevo);
  await expect(page.getByText("Registro exitoso")).toBeVisible();
});

test("TC-6 Verificar que el usuario np pueda registrarse con un correo ya existente", async ({
  page,
}) => {
  const email =
    TestData.usuario[0].email.split("@")[0] +
    "camilatest" +
    Date.now().toString() +
    "@" +
    TestData.usuario[0].email.split("@")[1];

  const usuarioNuevo = { ...TestData.usuario[0], email };

  await registerPage.fillAndSubmitForm(usuarioNuevo);
  await expect(page.getByText("Registro exitoso")).toBeVisible();
  await registerPage.visit();
  await registerPage.fillAndSubmitForm(usuarioNuevo);
  await expect(page.getByText("Email already in use")).toBeVisible();
  await expect(page.getByText("Registro exitoso")).not.toBeVisible();
});
