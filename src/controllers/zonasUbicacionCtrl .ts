import { Request, Response } from "express";
import { getconectionKiosco } from "../config/database";
import sql from "mssql";

const zonasUbicacionCtrl = {
  // Zonas
  addZona: async (req: Request, res: Response) => {
    const { nombre } = req.body;
    try {
      const pool = await getconectionKiosco();
      if (pool === false) return res.status(400).json({ message: "La base de datos no responde." });

      await pool.request()
        .input('nombre', sql.NVarChar, nombre)
        .query('INSERT INTO Zonas (Nombre) VALUES (@nombre)');

      res.json({ message: 'Zona agregada correctamente' });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },
  editZona: async (req: Request, res: Response) => {
    const { id, nombre } = req.body;
    try {
      const pool = await getconectionKiosco();
      if (pool === false) return res.status(400).json({ message: "La base de datos no responde." });

      await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.NVarChar, nombre)
        .query('UPDATE Zonas SET Nombre = @nombre WHERE ID = @id');

      res.json({ message: 'Zona actualizada correctamente' });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },
  deleteZona: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const pool = await getconectionKiosco();
      if (pool === false) return res.status(400).json({ message: "La base de datos no responde." });

      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Zonas WHERE ID = @id');

      res.json({ message: 'Zona eliminada correctamente' });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },
  listZonas: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco();
      if (pool === false) return res.status(400).json({ message: "La base de datos no responde." });

      const result = await pool.request().query('SELECT * FROM Zonas');
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },

  // Ubicacion
  addUbicacion: async (req: Request, res: Response) => {
    const { nombre, zonaID } = req.body;
    try {
      const pool = await getconectionKiosco();
      if (pool === false) return res.status(400).json({ message: "La base de datos no responde." });

      await pool.request()
        .input('nombre', sql.NVarChar, nombre)
        .input('zonaID', sql.Int, zonaID)
        .query('INSERT INTO Ubicacion (Nombre, ZonaID) VALUES (@nombre, @zonaID)');

      res.json({ message: 'Ubicación agregada correctamente' });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },
  editUbicacion: async (req: Request, res: Response) => {
    const { id, nombre, zonaID } = req.body;
    try {
      const pool = await getconectionKiosco();
      if (pool === false) return res.status(400).json({ message: "La base de datos no responde." });

      await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.NVarChar, nombre)
        .input('zonaID', sql.Int, zonaID)
        .query('UPDATE Ubicacion SET Nombre = @nombre, ZonaID = @zonaID WHERE ID = @id');

      res.json({ message: 'Ubicación actualizada correctamente' });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },
  deleteUbicacion: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const pool = await getconectionKiosco();
      if (pool === false) return res.status(400).json({ message: "La base de datos no responde." });

      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Ubicacion WHERE ID = @id');

      res.json({ message: 'Ubicación eliminada correctamente' });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  },
  listUbicaciones: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco();
      if (pool === false) return res.status(400).json({ message: "La base de datos no responde." });

      const result = await pool.request().query(`
      SELECT U.ID, U.Nombre AS UbicacionNombre, Z.Nombre AS ZonaNombre
      FROM Ubicacion U
      JOIN Zonas Z ON U.ZonaID = Z.ID
    `);
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde" });
    }
  }
};

export default zonasUbicacionCtrl;
