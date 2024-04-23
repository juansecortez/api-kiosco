import { getconectionKiosco } from "../config/database";
import { Request, Response } from "express";
import sql from "mssql";


async function ejecutarProcedimientoSolicitud(requestId: string, authorizedBy: string) {
  try {
    const pool = await getconectionKiosco();
    if (!pool) {
      throw new Error("Error en la base de datos");
    }

    // Realizar la ejecución del procedimiento almacenado
    const request = pool.request();
    request.input("sol_id", sql.Int, requestId);
    request.input("sol_usuarioidSolicitante", sql.VarChar(50), authorizedBy);
    
    const procedureQuery = `
      EXEC sp_EstatusSolicitud
        @sol_id = @sol_id,
        @sol_usuarioidSolicitante = @sol_usuarioidSolicitante
    `;

    await request.query(procedureQuery);
    pool.close();
  } catch (error) {
    throw error;
  }
}

const requestCtrl = {
  authorizeRequestHandler: async (req: Request, res: Response) => {
    const requestId = req.params.id;
    const authorizedBy = req.params.authorizedBy; // ID del usuario que está autorizando
  
    try {
      // Obtiene la conexión a la base de datos
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
  
      // Realizar la consulta para actualizar el campo de autorización en la tabla adecuada
      const request = pool.request();
      request.input("requestId", sql.Int, requestId);
      request.input("authorizedBy", sql.VarChar(50), authorizedBy);
  
      // Verificar el orden de autorización
      const orderQuery = `SELECT sol_autorizaNivel, sol_jefeInfraestructura, sol_jefeDesarrollo, sol_jefeSeguridad, sol_gerenciaTI, sol_direccionFinanzas, sol_direccionGeneral
                        FROM encabezado_solicitudes
                        WHERE sol_id = '${requestId}'`;
  
      const orderResult = await request.query(orderQuery);
  
      const {
        sol_autorizaNivel,
        sol_jefeInfraestructura,
        sol_jefeDesarrollo,
        sol_jefeSeguridad,
        sol_gerenciaTI,
        sol_direccionFinanzas,
        sol_direccionGeneral,
      } = orderResult.recordset[0];
  
      let updateQuery = "";
      let authorizedField = "";
  
      // Determinar el campo a actualizar y si el usuario actual está autorizado para actualizarlo
      if (authorizedBy === sol_autorizaNivel) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionNivel = 1, sol_fechaAutorizacionNivel = GETDATE()";
        authorizedField = "sol_autorizaNivel";
      } else if (authorizedBy === sol_jefeInfraestructura) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionJefeInfra = 1, sol_fechaAutorizacionJefeInfra = GETDATE()";
        authorizedField = "sol_jefeInfraestructura";
      } else if (authorizedBy === sol_jefeDesarrollo) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionJefeDesarrollo = 1, sol_fechaAutorizacionJefeDesarrollo = GETDATE()";
        authorizedField = "sol_jefeDesarrollo";
      } else if (authorizedBy === sol_jefeSeguridad) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionJefeSeguridad = 1, sol_fechaAutorizacionJefeSeguridad = GETDATE()";
        authorizedField = "sol_jefeSeguridad";
      } else if (authorizedBy === sol_gerenciaTI) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionGerenciaTI = 1, sol_fechaAutorizacionGerenciaTI = GETDATE()";
        authorizedField = "sol_gerenciaTI";
      } else if (authorizedBy === sol_direccionFinanzas) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionDirFinanzas = 1, sol_fechaAutorizacionDirFinanzas = GETDATE()";
        authorizedField = "sol_direccionFinanzas";
      } else if (authorizedBy === sol_direccionGeneral) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionDirGeneral = 1, sol_fechaAutorizacionDirGeneral = GETDATE()";
        authorizedField = "sol_direccionGeneral";
      } else {
        // El usuario actual no está autorizado para actualizar este campo
        res.status(400).json({
          message: "No tienes autorización para actualizar este campo",
        });
      }
  
      // Verificar si el usuario actual está autorizado para actualizar el campo correspondiente
      if (updateQuery !== "" && authorizedField !== "") {
        // Realizar la actualización del campo correspondiente
        await request.query(`${updateQuery} WHERE sol_id = '${requestId}'`);
  
        // Llamar a la función para ejecutar el procedimiento almacenado
        await ejecutarProcedimientoSolicitud(requestId, authorizedBy);
  
        res.sendStatus(200);
        pool.close();
      } else {
        res.status(400).json({
          message: "No tienes autorización para actualizar este campo",
        });
      }
    } catch (error) {
      console.error("Error al autorizar la solicitud:", error);
      res.status(500).send("Error en el servidor");
    }
  },
  
  rejectRequestHandler: async (req: Request, res: Response) => {
    const requestId = req.params.id;
    const rejectedBy = req.params.rejectedBy; // ID del usuario que está rechazando
  
    try {
      // Obtener la conexión a la base de datos
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
  
      // Realizar la consulta para obtener el orden de autorización y los campos correspondientes
      const orderQuery = `SELECT * FROM encabezado_solicitudes
      WHERE sol_id = '${requestId}'`;
      const request = pool.request();
      request.input("requestId", sql.Int, requestId);
      const orderResult = await request.query(orderQuery);
  
      const orderRecord = orderResult.recordset[0];
  
      let updateQuery = "";
  
      const rejectedByTrimmed = rejectedBy.trim();
  
      // Determinar el campo a actualizar
      if (orderRecord.sol_direccionGeneral !== null && rejectedByTrimmed === orderRecord.sol_direccionGeneral.trim()) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionDirGeneral = 0, sol_fechaAutorizacionDirGeneral = GETDATE(), sol_estatusSolicitud = 0";
      } else if (orderRecord.sol_direccionFinanzas !== null && rejectedByTrimmed === orderRecord.sol_direccionFinanzas.trim()) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionDirFinanzas = 0, sol_fechaAutorizacionDirFinanzas = GETDATE(), sol_autorizacionGerenciaTI = null";
      } else if (orderRecord.sol_gerenciaTI !== null && rejectedByTrimmed === orderRecord.sol_gerenciaTI.trim()) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionGerenciaTI = 0, sol_fechaAutorizacionGerenciaTI = GETDATE(), sol_autorizacionNivel = null";
      } else if (orderRecord.sol_jefeSeguridad !== null && rejectedByTrimmed === orderRecord.sol_jefeSeguridad.trim()) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionJefeSeguridad = 0, sol_fechaAutorizacionJefeSeguridad = GETDATE(), sol_autorizacionNivel = null";
      } else if (orderRecord.sol_jefeDesarrollo !== null && rejectedByTrimmed === orderRecord.sol_jefeDesarrollo.trim()) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionJefeDesarrollo = 0, sol_fechaAutorizacionJefeDesarrollo = GETDATE(), sol_autorizacionNivel = null";
      } else if (orderRecord.sol_jefeInfraestructura !== null && rejectedByTrimmed === orderRecord.sol_jefeInfraestructura.trim()) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionJefeInfra = 0, sol_fechaAutorizacionJefeInfra = GETDATE(), sol_autorizacionNivel = null";
      } else if (orderRecord.sol_autorizaNivel !== null && rejectedByTrimmed === orderRecord.sol_autorizaNivel.trim()) {
        updateQuery =
          "UPDATE encabezado_solicitudes SET sol_autorizacionNivel = 0, sol_fechaAutorizacionNivel = GETDATE(), sol_estatusSolicitud = 0";
      } else {
        return res.status(403).json({ message: "Usuario no autorizado" });
      }
  
      // Realizar la actualización en la base de datos
      const updateRequest = pool.request();
      const result = await updateRequest.query(`${updateQuery}
      WHERE sol_id = '${requestId}'`);
  
      // Verificar si la actualización fue exitosa
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Solicitud no encontrada" });
      }
  
      // Llamar a la función para ejecutar el procedimiento almacenado
      await ejecutarProcedimientoSolicitud(requestId, rejectedBy);
  
      // Enviar una respuesta exitosa
      return res
        .status(200)
        .json({ message: "Solicitud rechazada exitosamente" });
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  },
  
  
  markAsDone: async (req: Request, res: Response) => {
    const  idtask  = req.params.id;  // Obtener el ID de la solicitud desde los parámetros de la solicitud
    const  doneBy = req.params.doneBy; // Obtener la identidad del usuario desde el cuerpo de la solicitud

    const updateQuery = `UPDATE encabezado_solicitudes 
                         SET sol_doneBy = @doneBy 
                         WHERE sol_id = @id`;

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request()
        .input('doneBy', sql.VarChar, doneBy) // sql es tu biblioteca de conexión a la BD, ajusta según sea necesario
        .input('id', sql.Int, idtask)
        .query(updateQuery);

      res.status(200).json({ message: "Solicitud actualizada con éxito." });

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde." });
    }
  },

};

export default requestCtrl;
