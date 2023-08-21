import * as dotenv from "dotenv";
dotenv.config();

const validarVariableEntorno = (nombre: string) => {
  const valor = process.env[nombre];

  if (!valor) {
    throw new Error(`La variable de entorno ${nombre} es requerida`);
  }

  return valor;
};

export const CONFIG = {
  PORT: validarVariableEntorno("PORT") || process.env.PORT,
  DB_NAME: validarVariableEntorno("DB_NAME"),
  DB_SERVER: validarVariableEntorno("DB_SERVER"),
  DB_USER: validarVariableEntorno("DB_USER"),
};
