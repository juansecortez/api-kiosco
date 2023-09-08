import { Request, Response } from "express";
import { getconectionKiosco } from "../config/database";
import { IIssue } from "../interfaces/index";
import sql from "mssql";

const issueCtrl = {
  addIssue: async (req: Request, res: Response) => {
    const issue: IIssue = req.body;

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      await pool
        .request()
        .input("nombre", sql.NVarChar, issue.nombre)
        .input("tipo_id", sql.Int, issue.tipo_id)
        .query("INSERT INTO issue(nombre, tipo_id) VALUES (@nombre, @tipo_id)");

      res.json({ message: "Issue agregado correctamente" });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  getIssuesByType: async (req: Request, res: Response) => {
    const tipo: string = req.params.tipo; // Asumimos que el tipo se pasa como un parámetro en la URL

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool.request().input("tipo", sql.NVarChar, tipo)
        .query(`
                SELECT issue.id, 
                    CONCAT(issue.nombre, ' - ', tipo_issue.tipo) AS nombreConTipo
                FROM issue
                JOIN tipo_issue ON issue.tipo_id = tipo_issue.id
                WHERE tipo_issue.tipo = @tipo
            `);

      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  editIssue: async (req: Request, res: Response) => {
    const issue: IIssue = req.body;
    const { id } = req.params;

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      await pool
        .request()
        .input("id", sql.Int, id)
        .input("nombre", sql.NVarChar, issue.nombre)
        .input("tipo_id", sql.Int, issue.tipo_id)
        .query(
          "UPDATE issue SET nombre=@nombre, tipo_id=@tipo_id WHERE id=@id"
        );

      res.json({ message: "Issue actualizado correctamente" });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  deleteIssue: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      await pool
        .request()
        .input("id", sql.Int, id)
        .query("DELETE FROM issue WHERE id=@id");

      res.json({ message: "Issue eliminado correctamente" });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  getAllIssues: async (_: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      const result = await pool
        .request()
        .query(
          "SELECT issue.id, issue.nombre, tipo_issue.tipo AS tipo FROM issue JOIN tipo_issue ON issue.tipo_id = tipo_issue.id;"
        );

      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
};

export default issueCtrl;
