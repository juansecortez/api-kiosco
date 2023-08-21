-- Procedimiento Almacenado para Detalles de Acceso a Bases de datos
CREATE PROCEDURE sp_DetallesAccesoDatabase
	@tipo_id INT,
	@sol_usuarioidSolicitante VARCHAR(15),
	@sol_fechaSolicitud DATE,
	@bd_direccion varchar(50),
	@bd_gerencia varchar(50),
	@bd_jefatura varchar(50),
	@bd_solicitante varchar(50),
	@bd_justificacion varchar(250),
	@bd_tipoBaseDatos varchar(50),
	@bd_descripcion varchar(50)
	
AS
BEGIN

	DECLARE @sol_id INT

	-- Ejecutar el procedimiento almacenado de encabezado_solicitudes para insertar el encabezado
	EXEC sp_InsertarSolicitud @tipo_id, @sol_usuarioidSolicitante, @sol_fechaSolicitud							

	-- Obtener el sol_id generado para la solicitud recién insertada
	SET @sol_id = @@IDENTITY

	-- Insertar datos en detalles_altasUsers
	INSERT INTO detalles_accesoDatabase (bd_idSolicitud, bd_direccion, bd_gerencia, 
									 bd_jefatura, bd_solicitante, bd_justificacion, 
									 bd_tipoBaseDatos, bd_descripcion)
    VALUES (@sol_id, @bd_direccion, @bd_gerencia, @bd_jefatura, @bd_solicitante, 
			@bd_justificacion, @bd_tipoBaseDatos, @bd_descripcion)

END
