-- Procedimiento Almacenado para Actualizar el estatus de las solicitudes
-- si es que todos los del flujo ya autorizaron

CREATE PROCEDURE sp_EstatusSolicitud
	@sol_id INT,
	@sol_usuarioidSolicitante VARCHAR(15)
AS
BEGIN
	DECLARE @sol_idTipo INT,
			@sol_autorizacionNivel bit,
			@sol_autorizacionJefeInfra bit,
			@sol_autorizacionJefeDesarrollo bit,
			@sol_autorizacionJefeSeguridad bit,
			@sol_autorizacionGerenciaTI bit,
			@sol_autorizacionDirFinanzas bit,
			@sol_autorizacionDirGeneral bit

	-- Obtener los valores de las personas del flujo de autorización
	SELECT	@sol_idTipo = sol_idTipo,
			@sol_autorizacionNivel = sol_autorizacionNivel, 
			@sol_autorizacionJefeInfra = sol_autorizacionJefeInfra,
			@sol_autorizacionJefeDesarrollo = sol_autorizacionJefeDesarrollo,
			@sol_autorizacionJefeSeguridad = sol_autorizacionJefeSeguridad,
			@sol_autorizacionGerenciaTI = sol_autorizacionGerenciaTI,
			@sol_autorizacionDirFinanzas = sol_autorizacionDirFinanzas,
			@sol_autorizacionDirGeneral = sol_autorizacionDirGeneral
	FROM encabezado_solicitudes
	WHERE sol_id = @sol_id

	IF @sol_idTipo = 1
	BEGIN
		IF @sol_autorizacionNivel = 1 AND @sol_autorizacionJefeInfra = 1 AND  @sol_autorizacionGerenciaTI = 1
		BEGIN
		UPDATE encabezado_solicitudes SET sol_estatusSolicitud = 1
		WHERE sol_id = @sol_id
		END
	END
	ELSE IF @sol_idTipo = 2
	BEGIN
		IF @sol_autorizacionNivel = 1 AND @sol_autorizacionJefeInfra = 1 AND @sol_autorizacionJefeSeguridad = 1 AND  @sol_autorizacionGerenciaTI = 1
		BEGIN
		UPDATE encabezado_solicitudes SET sol_estatusSolicitud = 1
		WHERE sol_id = @sol_id
		END
	END
	ELSE IF @sol_idTipo = 3
	BEGIN
		IF @sol_autorizacionNivel = 1 AND @sol_autorizacionJefeInfra = 1 AND @sol_autorizacionJefeDesarrollo = 1 AND  @sol_autorizacionGerenciaTI = 1 AND @sol_autorizacionDirFinanzas = 1 AND @sol_autorizacionDirGeneral = 1
		BEGIN
		UPDATE encabezado_solicitudes SET sol_estatusSolicitud = 1
		WHERE sol_id = @sol_id
		END
	END
	ELSE IF @sol_idTipo = 4
	BEGIN
		IF @sol_autorizacionNivel = 1 AND @sol_autorizacionJefeInfra = 1 AND @sol_autorizacionJefeDesarrollo = 1 AND @sol_autorizacionJefeSeguridad = 1 AND  @sol_autorizacionGerenciaTI = 1 
		BEGIN
		UPDATE encabezado_solicitudes SET sol_estatusSolicitud = 1
		WHERE sol_id = @sol_id
		END
	END
	ELSE IF @sol_idTipo = 5
	BEGIN
		IF @sol_autorizacionNivel = 1 AND @sol_autorizacionJefeDesarrollo = 1 AND  @sol_autorizacionGerenciaTI = 1 
		BEGIN
		UPDATE encabezado_solicitudes SET sol_estatusSolicitud = 1
		WHERE sol_id = @sol_id
		END
	END
	ELSE IF @sol_idTipo = 6
	BEGIN
		IF @sol_autorizacionNivel = 1 AND @sol_autorizacionJefeInfra = 1 AND @sol_autorizacionJefeSeguridad = 1 AND  @sol_autorizacionGerenciaTI = 1 
		BEGIN
		UPDATE encabezado_solicitudes SET sol_estatusSolicitud = 1
		WHERE sol_id = @sol_id
		END
	END
END
