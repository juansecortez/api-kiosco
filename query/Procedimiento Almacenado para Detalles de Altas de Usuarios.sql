-- Procedimiento Almacenado para Detalles de Altas de Usuarios
CREATE PROCEDURE sp_DetallesAltasUsuarios
	@tipo_id INT,
	@sol_usuarioidSolicitante VARCHAR(15),
	@sol_fechaSolicitud DATE,
	@altas_nombreColaborador VARCHAR(250),
	@altas_direccion varchar(50),
	@altas_gerencia varchar(50),
	@altas_jefatura varchar(50),
	@altas_fechaInicio DATE,
	@altas_fechaFin DATE,
	@altas_necesitaCorreo INT,
	@altas_necesitaComputadora INT

AS
BEGIN

	DECLARE @sol_id INT

	-- Ejecutar el procedimiento almacenado de encabezado_solicitudes para insertar el encabezado
	EXEC sp_InsertarSolicitud @tipo_id, @sol_usuarioidSolicitante, @sol_fechaSolicitud							

	-- Obtener el sol_id generado para la solicitud recién insertada
	SET @sol_id = @@IDENTITY

	-- Insertar datos en detalles_altasUsers
	INSERT INTO detalles_altasUsers (altas_idSolicitud, altas_nombreColaborador, 
									 altas_direccion, altas_gerencia, altas_jefatura, 
									 altas_fechaInicio, altas_fechaFin, altas_necesitaCorreo, 
									 altas_necesitaComputadora)
    VALUES (@sol_id, @altas_nombreColaborador, @altas_direccion, @altas_gerencia, 
			@altas_jefatura, @altas_fechaInicio, @altas_fechaFin, @altas_necesitaCorreo, 
			@altas_necesitaComputadora)

END
