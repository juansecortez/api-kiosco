-- Procedimiento Almacenado para Detalles de Acceso a Internet
CREATE PROCEDURE sp_DetallesAccesoInternet
	@tipo_id INT,
	@sol_usuarioidSolicitante VARCHAR(15),
	@sol_fechaSolicitud DATE,
	@int_direccion varchar(50),
	@int_gerencia varchar(50),
	@int_jefatura varchar(50),
	@int_solicitante varchar(50),
	@int_justificacion varchar(250),
	@int_tipoInternet varchar(50),
	@int_descripcion varchar(50)
	
AS
BEGIN

	DECLARE @sol_id INT

	-- Ejecutar el procedimiento almacenado de encabezado_solicitudes para insertar el encabezado
	EXEC sp_InsertarSolicitud @tipo_id, @sol_usuarioidSolicitante, @sol_fechaSolicitud							

	-- Obtener el sol_id generado para la solicitud recién insertada
	SET @sol_id = @@IDENTITY

	-- Insertar datos en detalles_altasUsers
	INSERT INTO detalles_accesoInternet (int_idSolicitud, int_direccion, int_gerencia, 
									 int_jefatura, int_solicitante, int_justificacion, 
									 int_tipoInternet, int_descripcion)
    VALUES (@sol_id, @int_direccion, @int_gerencia, @int_jefatura, @int_solicitante, 
			@int_justificacion, @int_tipoInternet, @int_descripcion)

END
