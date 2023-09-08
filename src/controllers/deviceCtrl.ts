import { Request, Response } from "express";
import { getconectionKiosco1 } from "../config/database";
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
};

export default deviceCtrl;
