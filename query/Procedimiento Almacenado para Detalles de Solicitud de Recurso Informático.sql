-- Procedimiento Almacenado para Detalles de Solicitud de Recurso Informático
CREATE PROCEDURE sp_DetallesRecursoInfo
	@tipo_id INT,
	@sol_usuarioidSolicitante VARCHAR(15),
	@sol_fechaSolicitud DATE,
	@recu_direccion varchar(50),
	@recu_gerencia varchar(50),
	@recu_jefatura varchar(50),
	@recu_solicitante varchar(50),
	@recu_justificacion varchar(250),
	@recu_tipoRecursoInfo varchar(50),
	@recu_cantidad int,
	@recu_descripcion varchar(50)
	
AS
BEGIN

	DECLARE @sol_id INT

	-- Ejecutar el procedimiento almacenado de encabezado_solicitudes para insertar el encabezado
	EXEC sp_InsertarSolicitud @tipo_id, @sol_usuarioidSolicitante, @sol_fechaSolicitud							

	-- Obtener el sol_id generado para la solicitud recién insertada
	SET @sol_id = @@IDENTITY

	-- Insertar datos en detalles_altasUsers
	INSERT INTO detalles_recursoInfo (recu_idSolicitud, recu_direccion, recu_gerencia, 
									 recu_jefatura, recu_solicitante, recu_justificacion, 
									 recu_tipoRecursoInfo, recu_cantidad, recu_descripcion)
    VALUES (@sol_id, @recu_direccion, @recu_gerencia, @recu_jefatura, @recu_solicitante, 
			@recu_justificacion, @recu_tipoRecursoInfo, @recu_cantidad, @recu_descripcion)

END
