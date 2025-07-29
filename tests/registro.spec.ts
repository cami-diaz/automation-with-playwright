import { test, expect } from "@playwright/test";

test("TC-1 Verificación de elementos visuales en la página de registro", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator('input[name = "firstName"]')).toBeVisible();
  await expect(page.locator('input[name = "lastName"]')).toBeVisible();
  await expect(page.locator('input[name = "email"]')).toBeVisible();
  await expect(page.locator('input[name = "password"]')).toBeVisible();
  await expect(page.getByTestId("boton-registrarse")).toBeVisible();
});

test("TC-2 Verificar boton de registro inhabilitado por defecto", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await expect(page.getByTestId("boton-registrarse")).toBeDisabled();
});

test("TC-3 Verificar que el botón de registro se habilita al completar los campos", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator('input[name = "firstName"]').fill("Camila");
  await page.locator('input[name = "lastName"]').fill("Diaz");
  await page.locator('input[name = "email"]').fill("camila@email.com");
  await page.locator('input[name = "password"]').fill("password123");
  await expect(page.getByTestId("boton-registrarse")).toBeEnabled();
});

test("TC-4 Verificar redireccionamiento a la pagina de inicio de sesión al hacer click", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.getByTestId("boton-login-header-signup").click();
  await expect(page).toHaveURL("http://localhost:3000/login");
  await page.waitForTimeout(5000);
});

test("TC-5 Verificar registro exitoso", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('input[name = "firstName"]').fill("Camila");
  await page.locator('input[name = "lastName"]').fill("Test");
  await page
    .locator('input[name = "email"]')
    .fill("camilatest" + Date.now().toString() + "@email.com");
  await page.locator('input[name = "password"]').fill("password123");
  await page.getByTestId("boton-registrarse").click();
  await expect(page.getByText("Registro exitoso")).toBeVisible();
});

test("TC-6 Verificar que el usuario np pueda registrarse con un correo ya existente", async ({
  page,
}) => {
  const email = "camilatest" + Date.now().toString() + "@email.com";
  await page.goto("http://localhost:3000");
  await page.locator('input[name = "firstName"]').fill("Camila");
  await page.locator('input[name = "lastName"]').fill("Test");
  await page.locator('input[name = "email"]').fill(email);
  await page.locator('input[name = "password"]').fill("password123");
  await page.getByTestId("boton-registrarse").click();
  await expect(page.getByText("Registro exitoso")).toBeVisible();
  await page.goto("http://localhost:3000");
  await page.locator('input[name = "firstName"]').fill("Camila");
  await page.locator('input[name = "lastName"]').fill("Test");
  await page.locator('input[name = "email"]').fill(email);
  await page.locator('input[name = "password"]').fill("password123");
  await page.getByTestId("boton-registrarse").click();
  await expect(page.getByText("Email already in use")).toBeVisible();
  await expect(page.getByText("Registro exitoso")).not.toBeVisible();
});
