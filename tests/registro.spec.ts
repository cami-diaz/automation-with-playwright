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

test("TC-8 Verificar registro exitoso con datos validos verificando respuesta de la API", async ({
  page,
}) => {
  const email =
    TestData.usuario[0].email.split("@")[0] +
    "camilatest" +
    Date.now().toString() +
    "@" +
    TestData.usuario[0].email.split("@")[1];

  const usuarioNuevo = { ...TestData.usuario[0], email };
  await registerPage.fillForm(usuarioNuevo);
  // Verificar que la respuesta de la API sea exitosa - status code 201
  const responsePromise = page.waitForResponse(
    "http://localhost:6007/api/auth/signup"
  );
  await registerPage.hacerClickRegister();
  const response = await responsePromise;
  const responseBody = await response.json();

  expect(response.status()).toBe(201);
  expect(responseBody).toHaveProperty("token");
  expect(typeof responseBody.token).toBe("string");
  expect(responseBody).toHaveProperty("user");
  expect(responseBody.user).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      email: usuarioNuevo.email,
      firstName: usuarioNuevo.nombre,
      lastName: usuarioNuevo.apellido,
    })
  );

  await expect(page.getByText("Registro exitoso")).toBeVisible();
});

test("TC-9 Generar signup desde la API", async ({ page, request }) => {
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
  const responseBody = await response.json();
  expect(response.status()).toBe(201);
  expect(responseBody).toHaveProperty("token");
  expect(typeof responseBody.token).toBe("string");
  expect(responseBody).toHaveProperty("user");
  expect(responseBody.user).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      firstName: TestData.usuario[0].nombre,
      lastName: TestData.usuario[0].apellido,
      email: email,
    })
  );
});

test("TC-10 Verificar comportamiento del front ante un error 500 en el registro", async ({
  page,
}) => {
  const email =
    TestData.usuario[0].email.split("@")[0] +
    Date.now().toString() +
    "@" +
    TestData.usuario[0].email.split("@")[1];

  // Interceptar la solicitud de registro y devolver un error 500
  await page.route("**/api/auth/signup", (route) => {
    route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({ message: "Email already in use" }),
    });
  });

  // Llenar el formulario. La navegación se hace en beforeEach.
  await registerPage.firstNameInput.fill(TestData.usuario[0].nombre);
  await registerPage.lastNameInput.fill(TestData.usuario[0].apellido);
  await registerPage.emailInput.fill(email);
  await registerPage.passwordInput.fill(TestData.usuario[0].password);

  // Hacer clic en el botón de registro
  await registerPage.registerButton.click();

  // Verificar que se muestra un mensaje de error.
  await expect(page.getByText("Email already in use")).toBeVisible();
});
