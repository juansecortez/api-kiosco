import { Request, Response } from "express";
import { getconectionKiosco } from "../config/database";
import { getconectionKiosco2 } from "../config/database";
import { IRecurzo } from "interfaces";
import sql from "mssql";

const recurzoCtrl = {
  addRecurzo: async (req: Request, res: Response) => {
    const recurzo: IRecurzo = req.body;

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request()
        .input('nombre', sql.NVarChar, recurzo.nombre)
        .input('descripcion', sql.NVarChar, recurzo.descripcion)
        .input('nivel', sql.Int, recurzo.nivel)
        .input('jerarquia', sql.Int, recurzo.jerarquia)
        .input('precio', sql.Decimal(10, 2), recurzo.precio)
        .input('tipo_id', sql.Int, recurzo.tipo_id)
        .execute('AgregarRecursoInformatico')

      res.json({message: 'Recurso agregado correctamente'});

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  editRecurzo: async (req: Request, res: Response) => {
    const recurzo: IRecurzo = req.body;
    const { id } = req.params;

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.NVarChar, recurzo.nombre)
        .input('descripcion', sql.NVarChar, recurzo.descripcion)
        .input('nivel', sql.Int, recurzo.nivel)
        .input('jerarquia', sql.Int, recurzo.jerarquia)
        .input('precio', sql.Decimal(10, 2), recurzo.precio)
        
        .execute('EditarRecursoInformatico')

      res.json({message: 'Recurso actualizado correctamente'});

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  deleteRecurzo: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request()
        .input('id', sql.Int, id)
        .execute('EliminarRecursoInformatico')

      res.json({message: 'Recurso eliminado correctamente'});

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  getAllRecurzos: async (_: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request().execute('sp_GetAllRecursos');
      
      res.json(result.recordset);

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  getEmpleadoByCodigo: async (req: Request, res: Response) => {
    const { codigoEmpleado } = req.params; // Obtén el código de empleado de los parámetros de la solicitud
  
    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }
  
      const result = await pool
        .request()
        .input("codigoEmpleado", sql.Int, codigoEmpleado) // Agrega el parámetro del código de empleado
        .query(
          "SELECT TOP (1000) [NOMBRE], [PUESTO], [CODIGOEMPLEADO] " +
          "FROM [ArensoOrganigrama].[dbo].[View_ConsultaPersonalOrg] " +
          "WHERE [CODIGOEMPLEADO] = @codigoEmpleado"
        );
  
      res.json(result.recordset); // Devuelve el resultado de la consulta
  
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  
  insertEmpleadoSolicitud: async (req: Request, res: Response) => {
    const {
      NumeroEmpleado,
      NOMBRE,
      PUESTO,
      DesdeFecha,
      HastaFecha,
      HoraInicio,
      HoraFinalizacion,
      Concepto,
      Motivo,
      timeDifference,
      IdSolicitante,
      aPuesto

    } = req.body; // Obtén los datos necesarios del cuerpo de la solicitud
  
    try {
      const pool = await getconectionKiosco2();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }
  
      // Verificar si ya existe el registro con los mismos datos
      const checkDuplicate = `SELECT COUNT(*) as count FROM [dbo].[EmpleadoSolicitud]
        WHERE [NumeroEmpleado] = @NumeroEmpleado
        AND [NombreEmpleado] = @NOMBRE
        AND [Puesto] = @PUESTO
        AND [DesdeFecha] = @DesdeFecha
        AND [HastaFecha] = @HastaFecha
        AND [HoraInicio] = @HoraInicio
        AND [HoraFinalizacion] = @HoraFinalizacion
        AND [Concepto] = @Concepto
        AND [Motivo] = @Motivo
        AND [timeDifference] = @timeDifference
        AND [IdSolicitante] = @IdSolicitante
        AND [aPuesto] = @aPuesto`;
  
      const duplicateResult = await pool
        .request()
        .input("NumeroEmpleado", sql.Int, NumeroEmpleado)
        .input("NOMBRE", sql.NVarChar(255), NOMBRE)
        .input("PUESTO", sql.NVarChar(255), PUESTO)
        .input("DesdeFecha", sql.Date, DesdeFecha)
        .input("HastaFecha", sql.Date, HastaFecha)
        .input("HoraInicio", sql.NVarChar(255), HoraInicio)
        .input("HoraFinalizacion", sql.NVarChar(255), HoraFinalizacion)
        .input("Concepto", sql.NVarChar(255), Concepto)
        .input("Motivo", sql.NVarChar(255), Motivo)
        .input("timeDifference", sql.NVarChar(255), timeDifference)
        .input("IdSolicitante", sql.NVarChar(255), IdSolicitante)
        .input("aPuesto", sql.NVarChar(255), aPuesto)
        .query(checkDuplicate);
  
      if (duplicateResult.recordset[0].count > 0) {
        return res.status(400).json({
          message: "Ya existe un registro con los mismos datos.",
        });
      }
  
      const query = `INSERT INTO [dbo].[EmpleadoSolicitud]
        ([NumeroEmpleado]
        ,[NombreEmpleado]
        ,[Puesto]
        ,[DesdeFecha]
        ,[HastaFecha]
        ,[HoraInicio]
        ,[HoraFinalizacion]
        ,[Concepto]
        ,[Motivo]
        ,[timeDifference]
        ,[IdSolicitante]
        ,[aPuesto] )
      VALUES
        (@NumeroEmpleado
        ,@NOMBRE
        ,@PUESTO
        ,@DesdeFecha
        ,@HastaFecha
        ,@HoraInicio
        ,@HoraFinalizacion
        ,@Concepto
        ,@Motivo
        ,@timeDifference
        ,@IdSolicitante
        ,@aPuesto)`;
  
      const result = await pool
        .request()
        .input("NumeroEmpleado", sql.Int, NumeroEmpleado)
        .input("NOMBRE", sql.NVarChar(255), NOMBRE)
        .input("PUESTO", sql.NVarChar(255), PUESTO)
        .input("DesdeFecha", sql.Date, DesdeFecha)
        .input("HastaFecha", sql.Date, HastaFecha)
        .input("HoraInicio", sql.NVarChar(255), HoraInicio)
        .input("HoraFinalizacion", sql.NVarChar(255), HoraFinalizacion)
        .input("Concepto", sql.NVarChar(255), Concepto)
        .input("Motivo", sql.NVarChar(255), Motivo)
        .input("timeDifference", sql.NVarChar(255), timeDifference)
        .input("IdSolicitante", sql.NVarChar(255), IdSolicitante)
        .input("aPuesto", sql.NVarChar(255), aPuesto)
        .query(query);
  
      res.json({ message: "EmpleadoSolicitud insertado correctamente" });
  
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  getAllEmpleadoSolicitud: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco2();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }
  
      const query = "SELECT * FROM [dbo].[EmpleadoSolicitud]";
      
      const result = await pool.request().query(query);
  
      res.json(result.recordset);
  
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  eliminarEmpleadoSolicitudPorCampos: async (req: Request, res: Response) => {
    const { HoraInicio, HoraFinalizacion, NOMBRE } = req.params;

    try {
        const pool = await getconectionKiosco2();
        if (pool === false) {
            return res.status(400).json({
                message: "La base de datos no responde.",
            });
        }

        const query = `DELETE FROM [dbo].[EmpleadoSolicitud] WHERE HoraInicio = @HoraInicio AND HoraFinalizacion = @HoraFinalizacion AND NombreEmpleado = @NOMBRE`;

        await pool.request()
            .input('HoraInicio', sql.NVarChar(255), HoraInicio)
            .input('HoraFinalizacion', sql.NVarChar(255), HoraFinalizacion)
            .input('NOMBRE', sql.NVarChar(255), NOMBRE)
            .query(query);

        res.json({ message: "EmpleadoSolicitud eliminado correctamente" });

    } catch (error: any) {
        console.log({ message: error.message });
        return res.status(500).json({
            message: "El servidor no responde",
        });
    }
},

eliminarEmpleadoSolicitudPorId: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const pool = await getconectionKiosco2();
        if (pool === false) {
            return res.status(400).json({
                message: "La base de datos no responde.",
            });
        }

        const query = `DELETE FROM [dbo].[EmpleadoSolicitud] WHERE id = @id`;

        await pool.request().input('id', sql.Int, id).query(query);

        res.json({ message: "EmpleadoSolicitud eliminado correctamente" });

    } catch (error: any) {
        console.log({ message: error.message });
        return res.status(500).json({
            message: "El servidor no responde",
        });
    }
},

listarEmpleadoSolicitudPorIdSolicitante: async (req: Request, res: Response) => {
    const { IdSolicitante } = req.params;

    try {
        const pool = await getconectionKiosco2();
        if (pool === false) {
            return res.status(400).json({
                message: "La base de datos no responde.",
            });
        }

        const query = `SELECT * FROM [dbo].[EmpleadoSolicitud] WHERE IdSolicitante = @IdSolicitante`;

        const result = await pool.request().input('IdSolicitante', sql.NVarChar(255), IdSolicitante).query(query);

        res.json(result.recordset);

    } catch (error: any) {
        console.log({ message: error.message });
        return res.status(500).json({
            message: "El servidor no responde",
        });
    }
},
listarEmpleadoSolicitudPorIdGerente: async (req: Request, res: Response) => {
  const { IdGerente } = req.params;

  try {
      const pool = await getconectionKiosco2();
      if (pool === false) {
          return res.status(400).json({
              message: "La base de datos no responde.",
          });
      }

      const query = `SELECT * 
FROM [dbo].[EmpleadoSolicitud] 
WHERE IdGerente = @IdGerente
ORDER BY 
    CASE estadoSolicitud
        WHEN 'Solicitado' THEN 1
        WHEN 'Aprobada' THEN 2
        WHEN 'Rechazada' THEN 3
        ELSE 4 -- En caso de que haya otros estados, los coloca al final
    END;`;

      const result = await pool.request().input('IdGerente', sql.NVarChar(255), IdGerente).query(query);

      res.json(result.recordset);

  } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
          message: "El servidor no responde",
      });
  }
},
  
agregarEstadoSolicitud: async (req: Request, res: Response) => {
  const IdSolicitud = req.params.IdSolicitud;
  const estadoSolicitud = req.body.estadoSolicitud; // Tomar del cuerpo en lugar de los parámetros

  try {
      const pool = await getconectionKiosco2();
      if (pool === false) {
          return res.status(400).json({
              message: "La base de datos no responde.",
          });
      }

      const query = `UPDATE [dbo].[EmpleadoSolicitud] SET estadoSolicitud = @estadoSolicitud WHERE ID = @IdSolicitud`;

      await pool.request()
          .input('IdSolicitud', sql.Int, IdSolicitud)
          .input('estadoSolicitud', sql.NVarChar(50), estadoSolicitud)
          .query(query);

      res.json({ message: "Estado de Solicitud actualizado correctamente" });

  } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
          message: "El servidor no responde",
      });
  }
}
};

export default recurzoCtrl;
