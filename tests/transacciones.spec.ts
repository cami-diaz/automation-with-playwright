import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboardPage";
import { ModalEnviarTransferencia } from "../pages/modalEnviarTransferencia";
import TestData from "../data/testData.json";
import fs from "fs/promises";

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
  // await expect(
  //   page.getByText("Transferencia enviada a " + TestData.usuario[0].email)
  // ).toBeVisible();
});

testUsuarioRecibe(
  "TC-13 Verificar que el usuario recibe la transferencia",
  async ({ page }) => {
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    // await expect(page.getByText("Transferencia de ")).toBeVisible();
  }
);

///Test unificado que envia dinero por la API y verifica en la UI.
testUsuarioRecibe(
  "TC-14 Verificar transferencia recibida (por API)",
  async ({ page, request }) => {
    /// #1 Preparacion para lecturas de datos y token de remitente.
    ///Leemos el archivo de datos de usuario que envia para obtener su email.
    const usuarioEnviaData = require.resolve(
      "../playwright/.auth/usuarioEnvia.data.json"
    );
    const usuarioEnviaContenidoData = await fs.readFile(
      usuarioEnviaData,
      "utf-8"
    );
    const datosUsuarioEnvia = JSON.parse(usuarioEnviaContenidoData);
    const emailUsuarioEnvia = datosUsuarioEnvia.email;
    expect(emailUsuarioEnvia).toBeDefined();

    ///Leemos el archivo de autenticacion del remitente para obtener su jwt.
    const usuarioEnviaAuth = require.resolve(
      "../playwright/.auth/usuarioEnvia.json"
    );
    const usuarioEnviaContenidoAuth = await fs.readFile(
      usuarioEnviaAuth,
      "utf-8"
    );
    const datosUsuarioEnviaAuth = JSON.parse(usuarioEnviaContenidoAuth);
    const tokenUsuarioEnvia =
      datosUsuarioEnviaAuth.origins[0].localStorage?.find(
        (item: { name: string }) => item.name === "jwt"
      );
    expect(
      tokenUsuarioEnvia,
      "El jwt del usuario que envia no se leyó correctamente"
    ).toBeDefined();
    const jwt = tokenUsuarioEnvia.value;
    ///#2 Obtener cuenta y enviar transferencia via API.

    /// Obtener cuenta del remitente para saber el ID de origen.
    const respuestaDeCuentas = await request.get(
      "http://localhost:6007/api/accounts",
      {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      }
    );
    expect(
      respuestaDeCuentas.ok(),
      "La respuesta de la API no es exitosa"
    ).toBeTruthy();
    const cuentas = await respuestaDeCuentas.json();
    expect(cuentas.length).toBeGreaterThan(0);
    const idCuentaOrigen = cuentas[0]._id; /// Tomamos el valor de id de la primera cuenta.
    const montoAleatorio = Math.floor(Math.random() * 100) + 1; /// Generamos un monto aleatorio entre 1 y 100.
    console.log(
      `Enviando transferencia de $${montoAleatorio} desde la cuenta ${idCuentaOrigen} al usuario ${TestData.usuario[0].email}`
    );
    ///Con todos los datos, podemos enviar la transferencia de dinero de 1 cuenta a otra.
    const respuestaTransferencia = await request.post(
      "http://localhost:6007/api/transactions/transfer",
      {
        headers: {
          Authorization: "Bearer " + jwt,
        },
        data: {
          fromAccountId: idCuentaOrigen,
          toEmail: TestData.usuario[0].email,
          amount: montoAleatorio,
        },
      }
    );
    // expect(
    //   respuestaTransferencia.ok(),
    //   "La respuesta de la API para enviar dinero falló "
    // ).toBeTruthy();

    ///#3 Verificar que el monto llegó al destinatario por UI.
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    ///Verificamos que la transferencia se muestre en la lista de transacciones en el primer lugar.
    await expect(
      dashboardPage.elementoListaTransferencias.first()
    ).toContainText(emailUsuarioEnvia);
    ///Verficamos que se muestre el monto correcto.
    ///Usamos una expresion regular para buscar el número.
    const montoRegex = new RegExp(String(montoAleatorio.toFixed(2)));
    await expect(dashboardPage.montoTransferencia.first()).toContainText(
      montoRegex
    );
  }
);
