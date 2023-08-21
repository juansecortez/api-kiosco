import { Request, Response } from "express";
import { getconectionKiosco } from "../config/database";
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
  }
};

export default recurzoCtrl;
