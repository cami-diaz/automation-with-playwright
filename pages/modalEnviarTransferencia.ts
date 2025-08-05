import { Page, Locator } from "@playwright/test";

export class ModalEnviarTransferencia {
  readonly page: Page;
  readonly emailDestinatarioInput: Locator;
  readonly cuentaOrigenDropdown: Locator;
  readonly montoInput: Locator;
  readonly botonCancelar: Locator;
  readonly botonEnviar: Locator;
  readonly cuentaOrigenOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailDestinatarioInput = this.page.getByRole("textbox", {
      name: "Email del destinatario *",
    });
    this.cuentaOrigenDropdown = this.page.getByRole("combobox", {
      name: "Cuenta origen *",
    });
    this.montoInput = this.page.getByRole("spinbutton", {
      name: "Monto a enviar *",
    });
    this.botonCancelar = this.page.getByRole("button", { name: "Cancelar" });
    this.botonEnviar = this.page.getByRole("button", { name: "Enviar" });
    this.cuentaOrigenOption = this.page.getByRole("option", { name: "••••" });
  }

  async completarYhacerClickEnviar(emailDestinatario: string, monto: string) {
    await this.emailDestinatarioInput.fill(emailDestinatario);
    await this.cuentaOrigenDropdown.click();
    await this.cuentaOrigenOption.first().click();
    await this.montoInput.fill(monto);
    await this.botonEnviar.click();
  }
}
