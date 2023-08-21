import { getconectionKiosco } from "../config/database";
import { Request, Response } from "express";
import sql from "mssql";

const selectsCtrl = {
  directions: async (req: Request, res: Response) => {
    const consultaSql = `SELECT * FROM catalogo_direccion`;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  getRecurzosByType: async (req: Request, res: Response) => {
    const { tipo_id } = req.params;

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request()
        .input('tipo_id', sql.Int, tipo_id)
        .execute('sp_getResourcesByType')

      res.json(result.recordset);

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  management: async (req: Request, res: Response) => {
    const consultaSql = `SELECT * FROM catalogo_gerencia`;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  leadership: async (req: Request, res: Response) => {
    const consultaSql = `SELECT * FROM catalogo_jefatura`;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  systems: async (req: Request, res: Response) => {
    const consultaSql = `SELECT * FROM catalogo_sistemasInfo`;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  resource: async (req: Request, res: Response) => {
    const consultaSql = `SELECT * FROM catalogo_tipoRecursoInfo`;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  folder: async (req: Request, res: Response) => {
    const consultaSql = `SELECT * FROM catalogo_tipoCarpeta`;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  database: async (req: Request, res: Response) => {
    const consultaSql = `SELECT * FROM catalogo_tipoBaseDatos`;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  internet: async (req: Request, res: Response) => {
    const consultaSql = `SELECT * FROM catalogo_tipoInternet`;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  userRegistrationID: async (req: Request, res: Response) => {
    const { usuarioid } = req.query;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const consultaSql = `SELECT * FROM detalles_altasUsers
                          WHERE altas_idSolicitud = '${usuarioid}'
                        `;
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  systemsID: async (req: Request, res: Response) => {
    const { usuarioid } = req.query;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const consultaSql = `SELECT * FROM detalles_accesoSistemas
                          WHERE sis_idSolicitud = '${usuarioid}'
                        `;
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  resourceID: async (req: Request, res: Response) => {
    const { usuarioid } = req.query;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const consultaSql = `SELECT * FROM detalles_recursoInfo
                          WHERE recu_idSolicitud = '${usuarioid}'
                        `;
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  folderID: async (req: Request, res: Response) => {
    const { usuarioid } = req.query;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const consultaSql = `SELECT * FROM detalles_accesoCarpetas
                          WHERE carp_idSolicitud = '${usuarioid}'
                        `;
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  databaseID: async (req: Request, res: Response) => {
    const { usuarioid } = req.query;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const consultaSql = `SELECT * FROM detalles_accesoDatabase
                          WHERE bd_idSolicitud = '${usuarioid}'
                        `;
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  internetID: async (req: Request, res: Response) => {
    const { usuarioid } = req.query;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const consultaSql = `SELECT * FROM detalles_accesoInternet
                          WHERE int_idSolicitud = '${usuarioid}'
                        `;
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  earrings: async (req: Request, res: Response) => {
    const consultaSql = `SELECT es.sol_id, es.sol_usuarioidSolicitante, es.sol_idTipo, ts.tipo_nombreSolicitud, es.sol_fechaSolicitud, es.sol_autorizaNivel, 
    es.sol_autorizaNivelNombre, es.sol_autorizacionNivel, es.sol_fechaAutorizacionNivel, es.sol_jefeInfraestructura, 
    es.sol_jefeInfraNombre, es.sol_autorizacionJefeInfra, es.sol_fechaAutorizacionJefeInfra, es.sol_jefeDesarrollo,
    es.sol_jefeDesarrolloNombre, es.sol_autorizacionJefeDesarrollo, es.sol_fechaAutorizacionJefeDesarrollo, es.sol_jefeSeguridad,
    es.sol_jefeSeguridadNombre, es.sol_autorizacionJefeSeguridad, es.sol_fechaAutorizacionJefeSeguridad, es.sol_gerenciaTI, 
    es.sol_gerenciaTINombre, es.sol_autorizacionGerenciaTI, es.sol_fechaAutorizacionGerenciaTI, es.sol_direccionFinanzas, 
    es.sol_dirFinanzasNombre, es.sol_autorizacionDirFinanzas,es.sol_fechaAutorizacionDirFinanzas, es.sol_direccionGeneral, 
    es.sol_dirGeneralNombre, es.sol_autorizacionDirGeneral, es.sol_fechaAutorizacionDirGeneral, es.sol_estatusSolicitud, 
    es.sol_doneBy
FROM encabezado_solicitudes AS es
JOIN tipos_solicitudes AS ts ON ts.tipo_id = es.sol_idTipo
WHERE es.sol_estatusSolicitud = 1 AND es.sol_doneBy IS NULL

                      `;
    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde." });
    }
  },
  executeSP: async (req: Request, res: Response) => {
    const { cadena } = req.params;

    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }

      let consultaSql = '';
      switch (cadena) {
        case 'DBDELTA':
          consultaSql = 'EXEC dbdelta'; // Ejecutar el SP "dbdelta"
          break;
        case 'DBGAMA':
          consultaSql = 'EXEC bdgama'; // Ejecutar el SP "dbgama"
          break;
        case 'DBMINAS':
          consultaSql = 'EXEC dbminas'; // Ejecutar el SP "dbminas"
          break;
        default:
          return res.status(400).json({ message: "Cadena de texto no válida." });
      }

      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      res.send(resultados);

    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  }
};

export default selectsCtrl;
