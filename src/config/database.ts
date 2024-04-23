import * as sql from "mssql";
import * as dotenv from "dotenv";
dotenv.config();

//Configuración para SQL Server query de conexión local
const dbSettingsKiosco = {
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  server: `${process.env.DB_SERVER}`,
  database: `${process.env.DB_NAME}`,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

//Conexión a la base de datos
export async function getconectionKiosco() {
  try {
    const pool = new sql.ConnectionPool(dbSettingsKiosco);
    await pool.connect();
    console.log(`Conectado a la base de datos ${process.env.DB_NAME}`);
    return pool;
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
    console.log("Error al conectar a la base de datos", error);
    return false;
  }
}

const dbSettingsKiosco1 = {
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  server: `${process.env.DB_SERVER}`,
  database: `${process.env.DB_NAME1}`,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustedConnection: true,
    trustServerCertificate: true,
  },
};
export async function getconectionKiosco1() {
  try {
    const pool = new sql.ConnectionPool(dbSettingsKiosco1);
    await pool.connect();
    console.log(`Conectado a la base de datos ${process.env.DB_NAME1}`);
    return pool;
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
    console.log("Error al conectar a la base de datos", error);
    return false;
  }
}
  const dbSettingsKiosco2 = {
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    server: `${process.env.DB_SERVER}`,
    database: `${process.env.DB_NAME2}`,
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustedConnection: true,
      trustServerCertificate: true,
    },
  };
  export async function getconectionKiosco2() {
    try {
      const pool = new sql.ConnectionPool(dbSettingsKiosco2);
      await pool.connect();
      console.log(`Conectado a la base de datos ${process.env.DB_NAME2}`);
      return pool;
    } catch (error) {
      console.error("Error al conectar a la base de datos", error);
      console.log("Error al conectar a la base de datos", error);
      return false;
    }
}
