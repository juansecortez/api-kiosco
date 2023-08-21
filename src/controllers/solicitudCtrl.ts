import { getconectionKiosco } from "../config/database";
import { Request, Response } from "express";
import sql from "mssql";

const solicitudCtrl = {
  cambiarEstadoServicio: async (req: Request, res: Response) => {
    const { ID, Estado } = req.body;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const result = await pool.request()
        .input('ID', sql.Int, ID)
        .input('Estado', sql.NVarChar(50), Estado)
        .execute('CambiarEstadoServicio');
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  getServiceById: async (req: Request, res: Response) => {
    const { ID } = req.params; // Suponiendo que el ID del servicio se pasa como parámetro en la URL
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const result = await pool.request()
        .input('ServiceId', sql.Int, ID)
        .execute('GetServiceById');
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  listarSolicitudes: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const result = await pool.request().execute('ListarSolicitudes');
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  crearSolicitud: async (req: Request, res: Response) => {
    const { ID_Usuario, ID_Tecnico, Tipo, Ubicacion, Jefatura, Descripcion, Jerarquia, Estado } = req.body;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const result = await pool.request()
        .input('ID_Usuario', sql.NVarChar(25), ID_Usuario)
        .input('ID_Tecnico', sql.NVarChar(25), ID_Tecnico)
        .input('Tipo', sql.NVarChar(25), Tipo)
        .input('Ubicacion', sql.NVarChar(50), Ubicacion)
        .input('Jefatura', sql.NVarChar(50), Jefatura)
        .input('Descripcion', sql.NVarChar(1000), Descripcion)
        .input('Jerarquia', sql.Int, Jerarquia)
        .input('Estado', sql.NVarChar(50), Estado || 'Pendiente')
        .execute('CrearSolicitud');
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  agregarComentario: async (req: Request, res: Response) => {
    const { ID_Servicio, ID_Usuario, Comentario } = req.body;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const result = await pool.request()
        .input('ID_Servicio', sql.Int, ID_Servicio)
        .input('ID_Usuario', sql.NVarChar(25), ID_Usuario)
        .input('Comentario', sql.NVarChar(1000), Comentario)
        .execute('AgregarComentario');
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  listarComentariosPorServicio: async (req: Request, res: Response) => {
    const { ID_Servicio } = req.params; // Suponiendo que el ID del servicio se pasa como parámetro en la URL
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const result = await pool.request()
        .input('ID_Servicio', sql.Int, ID_Servicio)
        .execute('ListarComentariosPorServicio');
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
};

export default solicitudCtrl;
