import { getconectionKiosco } from "../config/database";
import { Request, Response } from "express";
import sql from "mssql";

const queriesCtrl = {
  requestsMadeByID: async (req: Request, res: Response) => {
    const { usuarioid } = req.query;
    try {
      // Obtiene la conexión a la base de datos
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }

      // Ejecuta una consulta SQL en la tabla "tipos_solicitudes"
      const query = `USE KioscoIT
      SELECT es.sol_id, es.sol_usuarioidSolicitante, es.sol_idTipo, ts.tipo_nombreSolicitud, es.sol_fechaSolicitud, es.sol_autorizaNivel, 
            es.sol_autorizaNivelNombre, es.sol_autorizacionNivel, es.sol_fechaAutorizacionNivel, es.sol_jefeInfraestructura, 
            es.sol_jefeInfraNombre, es.sol_autorizacionJefeInfra, es.sol_fechaAutorizacionJefeInfra, es.sol_jefeDesarrollo,
            es.sol_jefeDesarrolloNombre, es.sol_autorizacionJefeDesarrollo, es.sol_fechaAutorizacionJefeDesarrollo, es.sol_jefeSeguridad,
            es.sol_jefeSeguridadNombre, es.sol_autorizacionJefeSeguridad, es.sol_fechaAutorizacionJefeSeguridad, es.sol_gerenciaTI, 
            es.sol_gerenciaTINombre, es.sol_autorizacionGerenciaTI, es.sol_fechaAutorizacionGerenciaTI, es.sol_direccionFinanzas, 
            es.sol_dirFinanzasNombre, es.sol_autorizacionDirFinanzas,es.sol_fechaAutorizacionDirFinanzas, es.sol_direccionGeneral, 
            es.sol_dirGeneralNombre, es.sol_autorizacionDirGeneral, es.sol_fechaAutorizacionDirGeneral, es.sol_estatusSolicitud
        FROM encabezado_solicitudes AS es
        JOIN tipos_solicitudes AS ts ON ts.tipo_id = es.sol_idTipo
        WHERE es.sol_usuarioidSolicitante = '${usuarioid}'

      `;
      const result = await pool.request().query(query);

      // Devuelve el resultado de la consulta en formato JSON
      res.json(result.recordset);
      pool.close();
    } catch (err: any) {
      console.error(err);
      res.status(500).send("Error en el servidor");
    }
  },
  requestsApproved: async (req: Request, res: Response) => {
    const { usuarioid } = req.query;

    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }

      const request = pool.request();

      const orderQuery = `SELECT sol_autorizaNivel, sol_jefeInfraestructura, sol_jefeDesarrollo, sol_jefeSeguridad, sol_gerenciaTI, sol_direccionFinanzas, sol_direccionGeneral
                          FROM encabezado_solicitudes
                          WHERE sol_estatusSolicitud IS NULL`;

      const orderResult = await request.query(orderQuery);
      const orderRecord = orderResult.recordset;

      let authorizedField = "";

      // Determinar el campo autorizado correspondiente al usuario
      for (const row of orderRecord) {
        if (row.sol_autorizaNivel === usuarioid) {
          authorizedField = `WHERE sol_autorizacionNivel IS NULL
          AND (sol_estatusSolicitud IS NULL)
          AND (sol_autorizaNivel `;
        } else if (row.sol_jefeInfraestructura === usuarioid) {
          authorizedField = `WHERE sol_autorizacionJefeInfra IS NULL
          AND (sol_estatusSolicitud IS NULL)
          AND (sol_jefeInfraestructura`;
        } else if (row.sol_jefeDesarrollo === usuarioid) {
          authorizedField = `WHERE sol_autorizacionJefeDesarrollo IS NULL
          AND (sol_estatusSolicitud IS NULL)
          AND (sol_jefeDesarrollo`;
        } else if (row.sol_jefeSeguridad === usuarioid) {
          authorizedField = `WHERE sol_autorizacionJefeSeguridad IS NULL
          AND (sol_estatusSolicitud IS NULL)
          AND (sol_jefeSeguridad`;
        } else if (row.sol_gerenciaTI === usuarioid) {
          authorizedField = `WHERE sol_autorizacionGerenciaTI IS NULL
          AND (sol_estatusSolicitud IS NULL)
          AND (sol_gerenciaTI`;
        } else if (row.sol_direccionFinanzas === usuarioid) {
          authorizedField = `WHERE sol_autorizacionDirFinanzas IS NULL
          AND (sol_estatusSolicitud IS NULL)
          AND (sol_direccionFinanzas`;
        } else if (row.sol_direccionGeneral === usuarioid) {
          authorizedField = `WHERE sol_autorizacionDirGeneral IS NULL
          AND (sol_estatusSolicitud IS NULL)
          AND (sol_direccionGeneral`;
        }
      }

      if (!authorizedField) {
        return res.json([]);
      }

      const queryConsult = `SELECT es.sol_id, es.sol_usuarioidSolicitante, es.sol_idTipo, ts.tipo_nombreSolicitud, es.sol_fechaSolicitud, es.sol_autorizaNivel, 
                                  es.sol_autorizaNivelNombre, es.sol_autorizacionNivel, es.sol_fechaAutorizacionNivel, es.sol_jefeInfraestructura, 
                                  es.sol_jefeInfraNombre, es.sol_autorizacionJefeInfra, es.sol_fechaAutorizacionJefeInfra, es.sol_jefeDesarrollo,
                                  es.sol_jefeDesarrolloNombre, es.sol_autorizacionJefeDesarrollo, es.sol_fechaAutorizacionJefeDesarrollo, es.sol_jefeSeguridad,
                                  es.sol_jefeSeguridadNombre, es.sol_autorizacionJefeSeguridad, es.sol_fechaAutorizacionJefeSeguridad, es.sol_gerenciaTI, 
                                  es.sol_gerenciaTINombre, es.sol_autorizacionGerenciaTI, es.sol_fechaAutorizacionGerenciaTI, es.sol_direccionFinanzas, 
                                  es.sol_dirFinanzasNombre, es.sol_autorizacionDirFinanzas,es.sol_fechaAutorizacionDirFinanzas, es.sol_direccionGeneral, 
                                  es.sol_dirGeneralNombre, es.sol_autorizacionDirGeneral, es.sol_fechaAutorizacionDirGeneral, es.sol_estatusSolicitud
                            FROM encabezado_solicitudes AS es
                            JOIN tipos_solicitudes AS ts ON ts.tipo_id = es.sol_idTipo`;

      const updateQuery = `USE KioscoIT
                          ${queryConsult}
                          ${authorizedField} = '${usuarioid}')`;

      const result = await request.query(updateQuery);
      const solicitudes = Array.isArray(result.recordset)
        ? result.recordset
        : [];

      res.json(solicitudes);

      pool.close();
    } catch (error: any) {
      console.error("Error al obtener las solicitudes aprobadas:", error);
      res.status(500).send("Error en el servidor");
    }
  },
};

export default queriesCtrl;
