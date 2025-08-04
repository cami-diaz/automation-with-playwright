import { APIRequestContext, expect } from "@playwright/test";

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}
export class BackendUtils {
  static async crearUsuarioPorAPI(
    request: APIRequestContext,
    usuario: Usuario
  ) {
    const email =
      usuario.email.split("@")[0] +
      Date.now().toString() +
      "@" +
      usuario.email.split("@")[1];
    const response = await request.post(
      "http://localhost:6007/api/auth/signup",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        data: {
          firstName: usuario.nombre,
          lastName: usuario.apellido,
          email: email,
          password: usuario.password,
        },
      }
    );
    expect(response.status()).toBe(201);
    return {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: email,
      password: usuario.password,
    };
  }
}
