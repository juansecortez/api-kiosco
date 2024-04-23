import { getconectionKiosco } from "../config/database";
import { Request, Response } from "express";

const makeRequestCtrl = {
  userResgistration: async (req: Request, res: Response) => {
    const {
      tipo_id,
      sol_usuarioidSolicitante,
      altas_nombreColaborador,
      altas_direccion,
      altas_gerencia,
      altas_jefatura,
      altas_fechaInicio,
      altas_fechaFin,
      altas_necesitaCorreo,
      altas_necesitaComputadora,
    } = req.body;

    let date = new Date();
    const formatDate = (date: any) => {
      let formatted_date =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return formatted_date;
    };

    // GETDATE()
    const consultaSql = `EXEC sp_DetallesAltasUsuarios
      @tipo_id = '${tipo_id}',
      @sol_usuarioidSolicitante = '${sol_usuarioidSolicitante}',
      @sol_fechaSolicitud = '${formatDate(date)}', 
      @altas_nombreColaborador =  '${altas_nombreColaborador}',
      @altas_direccion = '${altas_direccion}',
      @altas_gerencia = '${altas_gerencia}',
      @altas_jefatura = '${altas_jefatura}',
      @altas_fechaInicio = '${altas_fechaInicio}',
      @altas_fechaFin = '${altas_fechaFin}',
      @altas_necesitaCorreo = '${altas_necesitaCorreo}',
      @altas_necesitaComputadora = '${altas_necesitaComputadora}'
      `;

    // ...

    try {
      // Obtén la conexión a la base de datos desde tu función de conexión
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      const sol_id = resultado.recordset[0].sol_id;
      // Si el procedimiento almacenado se ejecutó correctamente y se insertaron datos,
      // enviamos los datos insertados como respuesta al cliente.
      res.json({ message: "Solicitud radicada correctamente", data: sol_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al ejecutar el procedimiento almacenado." });
    }

  },
  accessSystems: async (req: Request, res: Response) => {
    const {
      tipo_id,
      sol_usuarioidSolicitante,
      sis_direccion,
      sis_gerencia,
      sis_jefatura,
      sis_nombreSistema,
      sis_funcionDesarrollar,
    } = req.body;

    let date = new Date();
    const formatDate = (date: any) => {
      let formatted_date =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return formatted_date;
    };

    // GETDATE()
    const consultaSql = `EXEC sp_DetallesAccesoSistemas
      @tipo_id = '${tipo_id}',
      @sol_usuarioidSolicitante = '${sol_usuarioidSolicitante}',
      @sol_fechaSolicitud = '${formatDate(date)}', 
      @sis_direccion = '${sis_direccion}',
      @sis_gerencia = '${sis_gerencia}',
      @sis_jefatura = '${sis_jefatura}',
      @sis_nombreSistema = '${sis_nombreSistema}',
      @sis_funcionDesarrollar = '${sis_funcionDesarrollar}'
      `;

    try {
      // Obtén la conexión a la base de datos desde tu función de conexión
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      const sol_id = resultado.recordset[0].sol_id;
      res.json({ message: "Solicitud radicada correctamente", data: sol_id });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  computerResource: async (req: Request, res: Response) => {
    const {
      tipo_id,
      sol_usuarioidSolicitante,
      recu_direccion,
      recu_gerencia,
      recu_jefatura,
      recu_solicitante,
      recu_justificacion,
      recu_tipoRecursoInfo,
      recu_cantidad,
      recu_descripcion,
      recu_recu,
    } = req.body;

    let date = new Date();
    const formatDate = (date: any) => {
      let formatted_date =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return formatted_date;
    };

    // GETDATE()
    const consultaSql = `EXEC sp_DetallesRecursoInfo
      @tipo_id = '${tipo_id}',
      @sol_usuarioidSolicitante = '${sol_usuarioidSolicitante}',
      @sol_fechaSolicitud = '${formatDate(date)}',
      @recu_direccion = '${recu_direccion}',
      @recu_gerencia = '${recu_gerencia}',
      @recu_jefatura = '${recu_jefatura}',
      @recu_solicitante = '${recu_solicitante}',
      @recu_justificacion = '${recu_justificacion}',
      @recu_tipoRecursoInfo = '${recu_tipoRecursoInfo}',
      @recu_cantidad = '${recu_cantidad}',
      @recu_descripcion = '${recu_descripcion}',
      @recu_recu = '${recu_recu}'
      `;

    try {
      // Obtén la conexión a la base de datos desde tu función de conexión
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      const sol_id = resultado.recordset[0].sol_id;
      res.json({ message: "Solicitud radicada correctamente", data:sol_id });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  folderAccess: async (req: Request, res: Response) => {
    const {
      tipo_id,
      sol_usuarioidSolicitante,
      carp_direccion,
      carp_gerencia,
      carp_jefatura,
      carp_solicitante,
      carp_justificacion,
      carp_tipoCarpeta,
      carp_descripcion,
    } = req.body;

    let date = new Date();
    const formatDate = (date: any) => {
      let formatted_date =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return formatted_date;
    };

    // GETDATE()
    const consultaSql = `EXEC sp_DetallesAccesoCarpetas
      @tipo_id = '${tipo_id}',
      @sol_usuarioidSolicitante = '${sol_usuarioidSolicitante}',
      @sol_fechaSolicitud = '${formatDate(date)}',
      @carp_direccion = '${carp_direccion}',
      @carp_gerencia = '${carp_gerencia}',
      @carp_jefatura = '${carp_jefatura}',
      @carp_solicitante = '${carp_solicitante}',
      @carp_justificacion = '${carp_justificacion}',
      @carp_tipoCarpeta = '${carp_tipoCarpeta}',
      @carp_descripcion = '${carp_descripcion}'
      `;

    try {
      // Obtén la conexión a la base de datos desde tu función de conexión
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      const sol_id = resultado.recordset[0].sol_id;
      res.json({ message: "Solicitud radicada correctamente", data: sol_id });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  databaseAccess: async (req: Request, res: Response) => {
    const {
      tipo_id,
      sol_usuarioidSolicitante,
      bd_direccion,
      bd_gerencia,
      bd_jefatura,
      bd_solicitante,
      bd_justificacion,
      bd_tipoBaseDatos,
      bd_bd,
      bd_descripcion,
    } = req.body;

    let date = new Date();
    const formatDate = (date: any) => {
      let formatted_date =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return formatted_date;
    };

    // GETDATE()
    const consultaSql = `EXEC sp_DetallesAccesoDatabase
      @tipo_id = '${tipo_id}',
      @sol_usuarioidSolicitante = '${sol_usuarioidSolicitante}',
      @sol_fechaSolicitud = '${formatDate(date)}',
      @bd_direccion = '${bd_direccion}',
      @bd_gerencia = '${bd_gerencia}',
      @bd_jefatura = '${bd_jefatura}',
      @bd_solicitante = '${bd_solicitante}',
      @bd_justificacion = '${bd_justificacion}',
      @bd_tipoBaseDatos = '${bd_tipoBaseDatos}',
      @bd_bd= '${bd_bd}',
      @bd_descripcion = '${bd_descripcion}'
      `;

    try {
      // Obtén la conexión a la base de datos desde tu función de conexión
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      const sol_id = resultado.recordset[0].sol_id;
      res.json({ message: "Solicitud radicada correctamente", data: sol_id });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
  internetAccess: async (req: Request, res: Response) => {
    const {
      tipo_id,
      sol_usuarioidSolicitante,
      int_direccion,
      int_gerencia,
      int_jefatura,
      int_solicitante,
      int_justificacion,
      int_tipoInternet,
      int_descripcion,
    } = req.body;

    let date = new Date();
    const formatDate = (date: any) => {
      let formatted_date =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return formatted_date;
    };

    // GETDATE()
    const consultaSql = `EXEC sp_DetallesAccesoInternet
      @tipo_id = '${tipo_id}',
      @sol_usuarioidSolicitante = '${sol_usuarioidSolicitante}',
      @sol_fechaSolicitud = '${formatDate(date)}',
      @int_direccion = '${int_direccion}',
      @int_gerencia = '${int_gerencia}',
      @int_jefatura = '${int_jefatura}',
      @int_solicitante = '${int_solicitante}',
      @int_justificacion = '${int_justificacion}',
      @int_tipoInternet = '${int_tipoInternet}',
      @int_descripcion = '${int_descripcion}'
      `;

    try {
      // Obtén la conexión a la base de datos desde tu función de conexión
      const pool = await getconectionKiosco();
      if (!pool) {
        return res.status(500).json({ message: "Error en la base de datos" });
      }
      const resultado = await pool.request().query(consultaSql);
      const resultados = resultado.recordset;
      const sol_id = resultado.recordset[0].sol_id;
      res.json({ message: "Solicitud radicada correctamente.", data: sol_id });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al ejecutar el procedimiento almacenado.");
    }
  },
};
export default makeRequestCtrl;
