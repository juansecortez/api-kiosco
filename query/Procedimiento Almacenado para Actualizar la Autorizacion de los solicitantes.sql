-- Procedimiento Almacenado para Actualizar la Autorizacion de los solicitantes si es que estan dentro del flujo
CREATE PROCEDURE sp_AutorizacionSolicitantesFlujo
	@sol_id INT,
	@sol_usuarioidSolicitante VARCHAR(15)
AS
BEGIN
	DECLARE @sol_jefeInfraestructura VARCHAR(15),
			@sol_jefeDesarrollo VARCHAR(15),
			@sol_jefeSeguridad VARCHAR(15),
			@sol_gerenciaTI VARCHAR(15),
			@sol_direccionFinanzas VARCHAR(15),
			@sol_direccionGeneral VARCHAR(15)

	-- Obtener los valores de las personas del flujo de autorización
	SELECT @sol_jefeInfraestructura = sol_jefeInfraestructura,
			@sol_jefeDesarrollo = sol_jefeDesarrollo,
			@sol_jefeSeguridad = sol_jefeSeguridad,
			@sol_gerenciaTI = sol_gerenciaTI,
			@sol_direccionFinanzas = sol_direccionFinanzas,
			@sol_direccionGeneral = sol_direccionGeneral
	FROM encabezado_solicitudes
	WHERE sol_id = @sol_id

	IF @sol_usuarioidSolicitante = @sol_jefeInfraestructura
	BEGIN
		UPDATE encabezado_solicitudes
		SET sol_autorizacionJefeInfra = 1, sol_fechaAutorizacionJefeInfra = GETDATE()
		WHERE sol_id = @sol_id
	END
	ELSE IF @sol_usuarioidSolicitante = @sol_jefeDesarrollo
	BEGIN
		UPDATE encabezado_solicitudes
		SET sol_autorizacionJefeDesarrollo = 1, sol_fechaAutorizacionJefeDesarrollo = GETDATE()
		WHERE sol_id = @sol_id
	END
	ELSE IF @sol_usuarioidSolicitante = @sol_jefeSeguridad
	BEGIN
		UPDATE encabezado_solicitudes
		SET sol_autorizacionJefeSeguridad = 1, sol_fechaAutorizacionJefeSeguridad = GETDATE()
		WHERE sol_id = @sol_id
	END
	ELSE IF @sol_usuarioidSolicitante = @sol_gerenciaTI
	BEGIN
		UPDATE encabezado_solicitudes
		SET sol_autorizacionGerenciaTI = 1, sol_fechaAutorizacionGerenciaTI = GETDATE()
		WHERE sol_id = @sol_id
	END
	ELSE IF @sol_usuarioidSolicitante = @sol_direccionFinanzas
	BEGIN
		UPDATE encabezado_solicitudes
		SET sol_autorizacionDirFinanzas = 1, sol_fechaAutorizacionDirFinanzas = GETDATE()
		WHERE sol_id = @sol_id
	END
	ELSE IF @sol_usuarioidSolicitante = @sol_direccionGeneral
	BEGIN
		UPDATE encabezado_solicitudes
		SET sol_autorizacionDirGeneral = 1, sol_fechaAutorizacionDirGeneral = GETDATE()
		WHERE sol_id = @sol_id
	END
END


-- Procedimiento Almacenado para Actualizar la Autorizacion de los solicitantes por nivel
CREATE PROCEDURE sp_AutorizacionSolicitantesNivel
	@sol_id INT,
	@sol_usuarioidSolicitante VARCHAR(15)

AS
BEGIN
	DECLARE @sol_autorizaNivel VARCHAR(15)

	-- Obtener el valor actualizado de sol_autorizaNivel desde la tabla encabezado_solicitudes
	SELECT @sol_autorizaNivel = sol_autorizaNivel
	FROM encabezado_solicitudes
	WHERE sol_id = @sol_id

	IF @sol_usuarioidSolicitante = @sol_autorizaNivel
	BEGIN
		UPDATE encabezado_solicitudes
		SET sol_autorizacionNivel = 1, sol_fechaAutorizacionNivel = GETDATE()
		WHERE sol_id = @sol_id
	END
END