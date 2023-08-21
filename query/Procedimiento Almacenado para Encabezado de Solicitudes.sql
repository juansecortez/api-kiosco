-- Procedimiento Almacenado para Encabezado de Solicitudes
CREATE PROCEDURE sp_InsertarSolicitud
	@tipo_id INT,
	@sol_usuarioidSolicitante VARCHAR(15),
	@sol_fechaSolicitud DATE

AS
BEGIN

	-- Declarar variables para los campos a actualizar en encabezado_solicitudes
    DECLARE @sol_autorizaNivel VARCHAR(15),
            @sol_jefeInfraestructura VARCHAR(15),
			@sol_jefeInfraNombre VARCHAR(50),
            @sol_jefeDesarrollo VARCHAR(15),
			@sol_jefeDesarrolloNombre VARCHAR(50),
            @sol_jefeSeguridad VARCHAR(15),
			@sol_jefeSeguridadNombre VARCHAR(50),
            @sol_gerenciaTI VARCHAR(15),
			@sol_gerenciaTINombre VARCHAR(50),
            @sol_direccionFinanzas VARCHAR(15),
			@sol_dirFinanzasNombre VARCHAR(50),
            @sol_direccionGeneral VARCHAR(15),
			@sol_dirGeneralNombre VARCHAR(50)

    -- Obtener los datos de tipos_solicitudes basándose en el tipo_id proporcionado
    SELECT @sol_autorizaNivel = tipo_autorizaNivel,
           @sol_jefeInfraestructura = tipo_jefeInfraestructura,
		   @sol_jefeInfraNombre =  tipo_jefeInfraNombre,
           @sol_jefeDesarrollo = tipo_jefeDesarrollo,
		   @sol_jefeDesarrolloNombre = tipo_jefeDesarrolloNombre,
           @sol_jefeSeguridad = tipo_jefeSeguridad,
		   @sol_jefeSeguridadNombre = tipo_jefeSeguridadNombre,
           @sol_gerenciaTI = tipo_gerenciaTI,
		   @sol_gerenciaTINombre = tipo_gerenciaTINombre,
           @sol_direccionFinanzas = tipo_direccionFinanzas,
		   @sol_dirFinanzasNombre = tipo_dirFinanzasNombre,
           @sol_direccionGeneral = tipo_direccionGeneral,
		   @sol_dirGeneralNombre = tipo_dirGeneralNombre
    FROM tipos_solicitudes
    WHERE tipo_id = @tipo_id

	--Obtener el jefe inmediato para poner su nombre y usuarioid *Falta hacerlo bien*
	DECLARE @sol_autorizaNivelNombre VARCHAR(50)
	--EXEC [dbo].[JEFE_INMEDIATO] @sol_usuarioidSolicitante
	--SET @sol_autorizaNivel = JEFE_INMEDIATO ID
	--SET @sol_autorizaNivelNombre = JEFE_INMEDIATO NAME
	-- se puso a gquiteno para prueba
	SET @sol_autorizaNivel = 'gquiteno'
	SET @sol_autorizaNivelNombre = 'Gibrán Ernesto Quiteño Carrillo'
	

	-- Insertar datos en encabezado_solicitudes
	INSERT INTO encabezado_solicitudes (sol_idTipo, sol_usuarioidSolicitante, 
										sol_fechaSolicitud, sol_autorizaNivel,
										sol_autorizaNivelNombre, sol_jefeInfraestructura,
										sol_jefeInfraNombre, sol_jefeDesarrollo, 
										sol_jefeDesarrolloNombre, sol_jefeSeguridad,
										sol_jefeSeguridadNombre, sol_gerenciaTI,
										sol_gerenciaTINombre, sol_direccionFinanzas,
										sol_dirFinanzasNombre, sol_direccionGeneral, 
										sol_dirGeneralNombre, sol_estatusSolicitud)
	VALUES (@tipo_id, @sol_usuarioidSolicitante, @sol_fechaSolicitud, @sol_autorizaNivel, 
			@sol_autorizaNivelNombre,@sol_jefeInfraestructura, @sol_jefeInfraNombre,
			@sol_jefeDesarrollo, @sol_jefeDesarrolloNombre, @sol_jefeSeguridad,  
			@sol_jefeSeguridadNombre, @sol_gerenciaTI, @sol_gerenciaTINombre,
			@sol_direccionFinanzas, @sol_dirFinanzasNombre, @sol_direccionGeneral, 
			@sol_dirGeneralNombre, NULL)

	-- Obtener el id
	DECLARE @sol_id INT
	SET @sol_id = @@IDENTITY

	-- Ejecutar el procedimiento almacenado de Actualizar la Autorizacion de los solicitantes si es que estan dentro del flujo
	EXEC sp_AutorizacionSolicitantesFlujo @sol_id, @sol_usuarioidSolicitante

	-- Ejecutar el procedimiento almacenado de Actualizar la autorización de los solicitantes por nivel si corresponde
	EXEC sp_AutorizacionSolicitantesNivel @sol_id, @sol_usuarioidSolicitante

END
