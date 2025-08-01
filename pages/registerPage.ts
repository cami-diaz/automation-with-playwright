import { Page, Locator } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = this.page.locator('input[name="firstName"]');
    this.lastNameInput = this.page.locator('input[name="lastName"]');
    this.emailInput = this.page.locator('input[name="email"]');
    this.passwordInput = this.page.locator('input[name="password"]');
    this.registerButton = this.page.getByTestId("boton-registrarse");
    this.loginButton = this.page.getByTestId("boton-login-header-signup");
  }

  async visit() {
    await this.page.goto("http://localhost:3000");
  }

  async fillForm(usuario: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
  }) {
    await this.firstNameInput.fill(usuario.nombre);
    await this.lastNameInput.fill(usuario.apellido);
    await this.emailInput.fill(usuario.email);
    await this.passwordInput.fill(usuario.password);
  }
  async hacerClickRegister() {
    await this.registerButton.click();
  }

  async fillAndSubmitForm(usuario: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
  }) {
    await this.fillForm(usuario);
    await this.hacerClickRegister();
  }
}
