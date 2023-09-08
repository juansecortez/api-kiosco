import { getconectionKiosco } from "../config/database";
import { Request, Response } from "express";
import sql from "mssql";
import fs from "fs";
import * as path from 'path';

const solicitudCtrl = {
  cambiarEstadoServicio: async (req: Request, res: Response) => {
    const { ID, Estado, ID_Tecnico, FechaModificacion, FechaFinalizacion } = req.body;
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const request = pool.request()
        .input("ID", sql.Int, ID)
        .input("Estado", sql.NVarChar(50), Estado)
        .input("ID_Tecnico", sql.NVarChar(25), ID_Tecnico);

      if (FechaModificacion) {
          request.input("FechaModificacion", sql.DateTime, FechaModificacion);
      }
      if (FechaFinalizacion) {
          request.input("FechaFinalizacion", sql.DateTime, FechaFinalizacion);
      }

      const result = await request.execute("CambiarEstadoServicio");
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
      const result = await pool
        .request()
        .input("ServiceId", sql.Int, ID)
        .execute("GetServiceById");
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
      const result = await pool.request().execute("ListarSolicitudes");
      res.json(result.recordset);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  listarSolicitudesId: async (req: Request, res: Response) => {
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }

      // Consulta para seleccionar todos los servicios por el ID_Usuario
      const query = `
            SELECT [ID]
                  ,[ID_Usuario]
                  ,[ID_Tecnico]
                  ,[Tipo]
                  ,[Ubicacion]
                  ,[Jefatura]
                  ,[Descripcion]
                  ,[Estado]
                  ,[FechaCreacion]
                  ,[FechaFinalizacion]
                  ,[Jerarquia]
            FROM [KioscoIT].[dbo].[Servicios]
            WHERE [ID_Usuario] = @UserID`;

      const userID = req.params.userID;

      const result = await pool
        .request()
        .input("UserID", sql.NVarChar, userID)
        .query(query);

      res.json(result.recordset);
      console.log("UserID:", userID);
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },

  crearSolicitud: async (req: Request, res: Response) => {
    const {
      ID_Usuario,
      ID_Tecnico,
      Tipo,
      Ubicacion,
      Jefatura,
      Descripcion,
      Jerarquia,
      Estado,
    } = req.body;

    try {
      const pool = await getconectionKiosco();
      
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }

      const result = await pool
        .request()
        .input("ID_Usuario", sql.NVarChar(25), ID_Usuario)
        .input("ID_Tecnico", sql.NVarChar(25), ID_Tecnico)
        .input("Tipo", sql.NVarChar(25), Tipo)
        .input("Ubicacion", sql.NVarChar(50), Ubicacion)
        .input("Jefatura", sql.NVarChar(50), Jefatura)
        .input("Descripcion", sql.NVarChar(1000), Descripcion)
        .input("Jerarquia", sql.Int, Jerarquia)
        .input("Estado", sql.NVarChar(50), Estado || "Pendiente")
        .execute("CrearSolicitud");

      // Asumiendo que el procedimiento almacenado devuelve una fila con un campo llamado 'ID'
      if (result.recordset[0] && result.recordset[0].ID) {
        res.json({ ID_Servicio: result.recordset[0].ID });
      } else {
        res.status(500).json({ message: "Error al obtener el ID de la solicitud" });
      }

    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
},

  subirImagen: async (req: Request, res: Response) => {
    
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    // El nombre del input del formulario debe ser "imagen"
    let imagen = (req as any).files.imagen;


    if (Array.isArray(imagen)) {
      imagen = imagen[0]; // Tomamos el primer archivo si es un array
    }

    const nombreImagen = Date.now() + "-" + imagen.name;
    const rutaRecursoCompartido = '\\\\PCMS-NAS5001\\RecursosSistemas\\'; // Ruta UNC del recurso compartido

    imagen.mv(`${rutaRecursoCompartido}${nombreImagen}`, async (err: any) => {
      if (err) {
        return res.status(500).send(err);
      }

      try {
        const pool = await getconectionKiosco();

        // Comprobación de la existencia de pool
        if (!pool) {
          return res.status(500).json({ message: "Error en la base de datos" });
        }

        // Ahora TypeScript sabe que pool no es `false` en este punto,
        // pero puedes ser más explícito con una afirmación de tipo si aún tienes problemas:
        const connectionPool = pool as sql.ConnectionPool;

        const query = `
          INSERT INTO [Imagenes] ([FileName], [ID_Servicio], [ID_Comentario], [ID_Externo])
          VALUES (@FileName, @ID_Servicio, @ID_Comentario, @ID_Externo);
        `;

        await pool
          .request()
          .input("FileName", sql.NVarChar, nombreImagen)
          .input("ID_Servicio", sql.Int, req.body.ID_Servicio || null)
          .input("ID_Comentario", sql.Int, req.body.ID_Comentario || null)
          .input("ID_Externo", sql.Int, req.body.ID_Externo || null)
          .query(query);

        res.json({ message: "Imagen subida exitosamente!" });
      } catch (error: any) {
        console.log({ message: error.message });
        return res.status(500).json({
          message: "El servidor no responde",
        });
      }
    });
  },

  imagenPorServicio: async (req: Request, res: Response) => {
    const { ID_Servicio } = req.params;
  
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
  
      const result = await pool
        .request()
        .input("ID_Servicio", sql.Int, ID_Servicio)
        .query(`SELECT [FileName] FROM [Imagenes] WHERE [ID_Servicio] = @ID_Servicio`);
  
      const fileName = result.recordset[0]?.FileName;
      const rutaRecursoCompartido = '\\\\PCMS-NAS5001\\RecursosSistemas\\'; // Ruta UNC del recurso compartido
      if (!fileName) {
        return res.status(404).json({ message: "Imagen no encontrada en la base de datos" });
      }
  
      const filePath = path.resolve(__dirname, `${rutaRecursoCompartido}${fileName}`);

      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      } else {
        return res.status(404).json({
          message: "Imagen no encontrada en el servidor",
        });
      }
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  imagenPorComentario: async (req: Request, res: Response) => {
    const { ID_Comentario } = req.params;
  
    try {
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
  
      const result = await pool
        .request()
        .input("ID_Comentario", sql.Int, ID_Comentario)
        .query(`SELECT [FileName] FROM [Imagenes] WHERE [ID_Comentario] = @ID_Comentario`);
  
      const fileName = result.recordset[0]?.FileName;
      const rutaRecursoCompartido = '\\\\PCMS-NAS5001\\RecursosSistemas\\'; // Ruta UNC del recurso compartido
      if (!fileName) {
        return res.status(404).json({ message: "Imagen no encontrada en la base de datos" });
      }
  
      const filePath = path.resolve(__dirname, `${rutaRecursoCompartido}${fileName}`);

      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      } else {
        return res.status(404).json({
          message: "Imagen no encontrada en el servidor",
        });
      }
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  imagenPorExterno: async (req: Request, res: Response) => {
    const { ID_Externo } = req.params;
    const baseURL = "http://vwebgama:4001/api/archivos"; // Esta es la base URL para acceder a los archivos.

    try {
        const pool = await getconectionKiosco();
        if (!pool) {
            return res.status(500).json({ message: "Error en la base de datos" });
        }

        const result = await pool
            .request()
            .input("ID_Externo", sql.Int, ID_Externo)
            .query(`SELECT [FileName] FROM [Imagenes] WHERE [ID_Externo] = @ID_Externo`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Imagen no encontrada en la base de datos" });
        }

        const imagesArray = result.recordset.map((file) => {
            const fileExtension = file.FileName.split('.').pop().toLowerCase();
            let fileType = 'unknown';

            // Aquí usas el switch que te proporcioné para determinar el fileType
            switch(fileExtension) {
              // Imágenes
              case 'jpg':
              case 'jpeg':
              case 'png':
              case 'gif':
              case 'bmp':
              case 'tiff':
                  fileType = 'image';
                  break;
              
              // Documentos de texto
              case 'doc':
              case 'docx':
                  fileType = 'word';
                  break;
              case 'pdf':
                  fileType = 'pdf';
                  break;
              case 'txt':
                  fileType = 'text';
                  break;
              case 'odt':
                  fileType = 'open-document';
                  break;
              case 'rtf':
                  fileType = 'rich-text';
                  break;
              
              // Hojas de cálculo
              case 'xls':
              case 'xlsx':
                  fileType = 'excel';
                  break;
              case 'ods':
                  fileType = 'open-sheet';
                  break;
              
              // Presentaciones
              case 'ppt':
              case 'pptx':
                  fileType = 'powerpoint';
                  break;
              case 'odp':
                  fileType = 'open-presentation';
                  break;
              
            }

            return {
                fileName: file.FileName,
                url: `${baseURL}/${file.FileName}`,
                fileType: fileType
            };
        });

        return res.json(imagesArray);

    } catch (error: any) {
        console.log({ message: error.message });
        return res.status(500).json({
            message: "El servidor no responde",
        });
    }
}

  
,
  
  agregarComentario: async (req: Request, res: Response) => {
    const { ID_Servicio, ID_Usuario, Comentario } = req.body;
    try {
        const pool = await getconectionKiosco();
        if (!pool) {
            return res.status(500).json({ message: "Error en la base de datos" });
        }

        // Define a variable to store the newly created comment ID
        let newCommentId = 0;

        const result = await pool
            .request()
            .input("ID_Servicio", sql.Int, ID_Servicio)
            .input("ID_Usuario", sql.NVarChar(25), ID_Usuario)
            .input("Comentario", sql.NVarChar(1000), Comentario)
            .output("ComentarioID", sql.Int) // Define output parameter for comment ID
            .execute("AgregarComentario");

        // Retrieve the newly created comment ID from the output parameter
        newCommentId = result.output.ComentarioID;

        res.json({ ID_Comentario: newCommentId }); // Return the ID of the newly created comment
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
      const result = await pool
        .request()
        .input("ID_Servicio", sql.Int, ID_Servicio)
        .execute("ListarComentariosPorServicio");
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
