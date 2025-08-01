import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = this.page.locator('input[name="email"]');
    this.passwordInput = this.page.locator('input[name="password"]');
    this.loginButton = this.page.getByTestId("boton-login");
  }

  async visit() {
    await this.page.goto("http://localhost:3000/login");
  }

  async fillForm(usuario: { email: string; password: string }) {
    await this.emailInput.fill(usuario.email);
    await this.passwordInput.fill(usuario.password);
  }
  async hacerClickBotonLogin() {
    await this.loginButton.click();
  }

  async fillAndSubmitForm(usuario: { email: string; password: string }) {
    await this.fillForm(usuario);
    await this.hacerClickBotonLogin();
  }
}
