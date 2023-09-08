import { Request, Response } from "express";
import { getconectionKiosco } from "../config/database";
import sql from "mssql";
import { sendEmail } from "../controllers/emailCtrl";

export const checkAndSendEmails = async () => {
  try {
    const pool = await getconectionKiosco();
    if (pool === false) throw new Error("La base de datos no responde.");

    const result = await pool.request().query("SELECT * FROM Externos");
    const externos = result.recordset;
    

    externos.forEach(async (externo: any) => {
      try {
        const currentDate = new Date();
        const dateAntivirus = new Date(externo.DATE_ANTIVIRUS);
        const datePedido = new Date(externo.DATE_PEDIDO);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
  

        const formattedDateAntivirus = dateAntivirus.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedDatePedido = datePedido.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        

        const diffTimeAntivirus = Math.abs(
          currentDate.getTime() - dateAntivirus.getTime()
        );
        const diffDaysAntivirus = Math.ceil(
          diffTimeAntivirus / (1000 * 60 * 60 * 24)
        );
        const diffTimePedido = Math.abs(
          currentDate.getTime() - datePedido.getTime()
        );
        const diffDaysPedido = Math.ceil(
          diffTimePedido / (1000 * 60 * 60 * 24)
        );
        console.log(`Verificando fecha para el externo ${externo.NOMBRES}...`);
        console.log(
          `Días restantes para vencimiento de antivirus: ${diffDaysAntivirus}`
        );
        console.log(
          `Días restantes para vencimiento de pedido: ${diffDaysPedido}`
        );
        

        let sendBaseEmail = false;
        let sendAvisoEmail = false;

        if (diffDaysAntivirus <= 10) {
          sendAvisoEmail = true; // Aviso normal para antivirus.
        }

        if (diffDaysPedido <= 10) {
          sendAvisoEmail = true; // Aviso normal para pedido.
          if (diffDaysAntivirus > 10) {
            sendBaseEmail = true; // Aviso especial si la fecha del antivirus aún no está por vencer.
          }
        }

        if (sendBaseEmail) {
          console.log(`Intentando enviar correo ...`);
          await sendEmail(
            "residente10@pcolorada.com",
            "", // CC - Ajusta según tu necesidad
            "Notificación Importante",
            `Se aproxima a fecha de actualizacion para el externo ${externo.NOMBRES}el antivirus vence en: ${formattedDateAntivirus} y el pedido en ${formattedDatePedido}.  Accede a el Kiosco y Actualizala.`,
            "http://vwebgama:4002/externos"
          );
          console.log(`Correo base enviado `);
        }

        if (sendAvisoEmail) {
          console.log(`Intentando enviar correo ...`);
          await sendEmail(
            "residente10@pcolorada.com",
            "",
            "Aviso Importante",
            `Se aproxima a fecha de actualizacion para el externo ${externo.NOMBRES}, y el pedido fechado el ${formattedDatePedido}  se vencerá antes que el antivirus fechado en ${formattedDateAntivirus} . Accede a el Kiosco y Actualizala.`,
            "http://vwebgama:4002/externos"
          );
          console.log(`Correo base enviado `);
        }
      } catch (error) {
        console.error(`Error enviando correo a ezamora:`, error);
      }
    });
  } catch (error) {
    console.error("Error en checkAndSendEmails:", error);
  }
};

const externosCtrl = {
  addExterno: async (req: Request, res: Response) => {
    const {
      EMPRESA,
      NOMBRES,
      MAC_WIFI,
      DATE_ANTIVIRUS,
      CONTRATO_CONFIDENCIALIDAD,
      AREA_PECO,
      CORREO,
      USER_AD,
      O365,
      TEAMS,
      VPN,
      RED,
      ENDPOINT,
      DATE_PEDIDO,
    } = req.body;

    try {
      const pool = await getconectionKiosco();
      if (pool === false)
        return res
          .status(400)
          .json({ message: "La base de datos no responde." });

      await pool
        .request()
        .input("EMPRESA", sql.VarChar, EMPRESA)
        .input("NOMBRES", sql.VarChar, NOMBRES)
        .input("MAC_WIFI", sql.VarChar, MAC_WIFI)
        .input("DATE_ANTIVIRUS", sql.Date, DATE_ANTIVIRUS)
        .input("DATE_PEDIDO", sql.Date, DATE_PEDIDO)
        .input(
          "CONTRATO_CONFIDENCIALIDAD",
          sql.VarChar,
          CONTRATO_CONFIDENCIALIDAD
        )
        .input("AREA_PECO", sql.VarChar, AREA_PECO)
        .input("CORREO", sql.VarChar, CORREO)
        .input("USER_AD", sql.VarChar, USER_AD)
        .input("O365", sql.VarChar, O365)
        .input("TEAMS", sql.VarChar, TEAMS)
        .input("VPN", sql.VarChar, VPN)
        .input("RED", sql.VarChar, RED)
        .input("ENDPOINT", sql.VarChar, ENDPOINT).query(`
            INSERT INTO Externos (
              EMPRESA, NOMBRES, MAC_WIFI, DATE_ANTIVIRUS,DATE_PEDIDO, CONTRATO_CONFIDENCIALIDAD,
              AREA_PECO, CORREO, USER_AD, O365, TEAMS, VPN, RED, ENDPOINT 
            ) VALUES (
              @EMPRESA, @NOMBRES, @MAC_WIFI, @DATE_ANTIVIRUS,@DATE_PEDIDO, @CONTRATO_CONFIDENCIALIDAD,
              @AREA_PECO, @CORREO, @USER_AD, @O365, @TEAMS, @VPN, @RED, @ENDPOINT 
            )
        `);

      res.json({ message: "Externo agregado correctamente" });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },

  editExterno: async (req: Request, res: Response) => {
    const { ID, ...rest } = req.body; // Desestructuramos para obtener el ID y el resto de los campos.
    console.log(req.body);

    const fields = [];
    for (let key in rest) {
      if (rest[key]) {
        // Solo si el valor está definido.
        fields.push(`${key} = @${key}`);
      }
    }

    try {
      const pool = await getconectionKiosco();
      if (pool === false)
        return res
          .status(400)
          .json({ message: "La base de datos no responde." });

      const request = pool.request().input("ID", sql.Int, ID);
      for (let key in rest) {
        if (rest[key]) {
          // Solo si el valor está definido.
          request.input(key, sql.VarChar, rest[key]); // Asumiendo que todos son VARCHAR.
        }
      }

      const queryString = `UPDATE Externos SET ${fields.join(
        ", "
      )} WHERE ID = @ID`;
      console.log(queryString);
      await request.query(queryString);
      res.json({ message: "Externo actualizado correctamente" });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },

  deleteExterno: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const pool = await getconectionKiosco();
      if (pool === false)
        return res
          .status(400)
          .json({ message: "La base de datos no responde." });

      await pool
        .request()
        .input("id", sql.Int, id)
        .query("DELETE FROM Externos WHERE ID = @id");

      res.json({ message: "Externo eliminado correctamente" });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },

  listExternos: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco();
      if (pool === false)
        return res
          .status(400)
          .json({ message: "La base de datos no responde." });

      const result = await pool.request().query("SELECT * FROM Externos");
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },
};

export default externosCtrl;
