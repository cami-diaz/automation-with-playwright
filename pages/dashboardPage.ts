import { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly dashboardTitle: Locator;
  readonly botonAgregarCuenta: Locator;
  readonly botonEnviarDinero: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle = this.page.getByTestId("titulo-dashboard");
    this.botonAgregarCuenta = this.page.getByTestId("tarjeta-agregar-cuenta");
    this.botonEnviarDinero = this.page.getByTestId("boton-enviar");
  }

  async visit() {
    await this.page.goto("http://localhost:3000/dashboard");
  }

  async hacerClickBotonAgregarCuenta() {
    await this.botonAgregarCuenta.click();
  }
}
