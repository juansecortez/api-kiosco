import { Request, Response } from "express";
import { getconectionKiosco1 } from "../config/database";
import { getconectionKiosco } from "../config/database";
import sql from "mssql";

const deviceCtrl = {
  getDeviceData: async (req: Request, res: Response) => {
    const { month, area, ubicacion, tipo } = req.params;

    try {
        const pool = await getconectionKiosco1();
        if (pool === false) {
            return res.status(400).json({
                message: "La base de datos no responde.",
            });
        }

        // Iniciar la consulta
        let query = `SELECT [Uptime (raw)], [Downtime (raw)], [Id] FROM [ExcelToSQLDB].[dbo].[${month}] WHERE 1=1`;

        if (area) {
            query += ` AND Area = @area`;
        }

        if (ubicacion) {
            query += ` AND Ubicacion = @ubicacion`;
        }

        if (tipo) {
            query += ` AND Tipo = @tipo`;
        }

        const result = await pool.request()
            .input('area', sql.NVarChar, area)
            .input('ubicacion', sql.NVarChar, ubicacion)
            .input('tipo', sql.NVarChar, tipo)
            .query(query);

        res.json(result.recordset);

    } catch (error: any) {
        console.log({ message: error.message });
        return res.status(500).json({
            message: "El servidor no responde",
        });
    }
  },

  listTables: async (_: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request()
        .query("SELECT name FROM sys.tables WHERE name LIKE '%_20%'");

      res.json(result.recordset.map(record => record.name));

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  listAreas: async (req: Request, res: Response) => {
    const { month } = req.params;

    try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request()
        .query(`SELECT DISTINCT Area FROM [ExcelToSQLDB].[dbo].[${month}]`);

      res.json(result.recordset.map(record => record.Area));

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  listUbicaciones: async (req: Request, res: Response) => {
    const { month, area } = req.params;

    try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request()
        .input('area', sql.NVarChar, area)
        .query(`SELECT DISTINCT Ubicacion FROM [ExcelToSQLDB].[dbo].[${month}] WHERE Area = @area`);

      res.json(result.recordset.map(record => record.Ubicacion));

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  listTipos: async (req: Request, res: Response) => {
    const { month } = req.params;

    try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request()
        .query(`SELECT DISTINCT Tipo FROM [ExcelToSQLDB].[dbo].[${month}]`);

      res.json(result.recordset.map(record => record.Tipo));

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  calculateStatsByLocation: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request().execute('sp_CalcularEstadisticasPorUbicacion');
      res.json(result.recordset);

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  calculateStatsByType: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request().execute('sp_CalcularEstadisticasPorTipo');
      res.json(result.recordset);

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  calculateStatsByArea: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request().execute('sp_CalcularEstadisticasPorArea');
      res.json(result.recordset);

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  getMetricsByState: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      // Obtener la cantidad de solicitudes por estado
      const query = `SELECT Estado, COUNT(ID) as count 
                     FROM [KioscoIT].[dbo].[Servicios]
                     GROUP BY Estado`;
                     
      const result = await pool.request().query(query);

      // Preparar la respuesta
      let stats = {
        Completado: 0,
        'En Progreso': 0,  // Agregado el espacio aquí
        Pendiente: 0,
        Total: 0
    };
    
    result.recordset.forEach(row => {
        switch (row.Estado) {
            case "Completado":
                stats.Completado = row.count;
                break;
            case "En Progreso":  // Asegúrate que esta cadena coincide exactamente con lo que esperas de la BD
                stats['En Progreso'] = row.count;  // Utiliza los corchetes para acceder a propiedades con espacios
                break;
            case "Pendiente":
                stats.Pendiente = row.count;
                break;
        }
        stats.Total += row.count;  // sumar al total
    });
    

      res.json(stats);

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  getMonthlyServicesByArea: async (req: Request, res: Response) => {
    try {
        const pool = await getconectionKiosco();
        if (pool === false) {
            return res.status(400).json({
                message: "La base de datos no responde.",
            });
        }

        let query = `
            SELECT 
                YEAR([FechaCreacion]) as Year,
                MONTH([FechaCreacion]) as Month,
                CASE
                    WHEN [Ubicacion] LIKE '%Mina' THEN 'Mina'
                    WHEN [Ubicacion] LIKE '%Peletizado' THEN 'Peletizado'
                    WHEN [Ubicacion] LIKE '%Presas' THEN 'Presas'
                    ELSE 'Otro'
                END as Area,
                COUNT(*) as TotalServices
            FROM [KioscoIT].[dbo].[Servicios]
            GROUP BY 
                YEAR([FechaCreacion]),
                MONTH([FechaCreacion]),
                CASE
                    WHEN [Ubicacion] LIKE '%Mina' THEN 'Mina'
                    WHEN [Ubicacion] LIKE '%Peletizado' THEN 'Peletizado'
                    WHEN [Ubicacion] LIKE '%Presas' THEN 'Presas'
                    ELSE 'Otro'
                END
            ORDER BY Year, Month, Area;
        `;

        const result = await pool.request().query(query);

        res.json(result.recordset);

    } catch (error: any) {
        console.log({ message: error.message });
        return res.status(500).json({
            message: "El servidor no responde",
        });
    }
},
getTotalServicesByArea: async (req: Request, res: Response) => {
  try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
          return res.status(400).json({
              message: "La base de datos no responde.",
          });
      }

      let query = `
          SELECT 
              CASE
                  WHEN [Ubicacion] LIKE '%Mina' THEN 'Mina'
                  WHEN [Ubicacion] LIKE '%Peletizado' THEN 'Peletizado'
                  WHEN [Ubicacion] LIKE '%Presas' THEN 'Presas'
                  ELSE 'Otro'
              END as Area,
              COUNT(*) as TotalServices
          FROM [KioscoIT].[dbo].[Servicios]
          GROUP BY 
              CASE
                  WHEN [Ubicacion] LIKE '%Mina' THEN 'Mina'
                  WHEN [Ubicacion] LIKE '%Peletizado' THEN 'Peletizado'
                  WHEN [Ubicacion] LIKE '%Presas' THEN 'Presas'
                  ELSE 'Otro'
              END
          ORDER BY Area;
      `;

      const result = await pool.request().query(query);

      res.json(result.recordset);

  } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
          message: "El servidor no responde",
      });
  }
},
getServicesByJefatura: async (req: Request, res: Response) => {
  try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
          return res.status(400).json({
              message: "La base de datos no responde.",
          });
      }

      let query = `
          SELECT 
              [Jefatura],
              COUNT(*) as TotalServices
          FROM [KioscoIT].[dbo].[Servicios]
          WHERE [Jefatura] IS NOT NULL
          GROUP BY [Jefatura]
          ORDER BY [Jefatura];
      `;

      const result = await pool.request().query(query);

      res.json(result.recordset);

  } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
          message: "El servidor no responde",
      });
  }
},
getServicesByIDTecnico: async (req: Request, res: Response) => {
  try {
      const pool = await getconectionKiosco1();
      if (pool === false) {
          return res.status(400).json({
              message: "La base de datos no responde.",
          });
      }

      let query = `
          SELECT 
              [ID_Tecnico],
              COUNT(*) as TotalServices
          FROM [KioscoIT].[dbo].[Servicios]
          WHERE [ID_Tecnico] IS NOT NULL
          GROUP BY [ID_Tecnico]
          ORDER BY [ID_Tecnico];
      `;

      const result = await pool.request().query(query);

      res.json(result.recordset);

  } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
          message: "El servidor no responde",
      });
  }
}
};

export default deviceCtrl;
