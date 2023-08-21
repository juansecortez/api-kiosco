use KioscoIT
-- Consulta para ver datos en encabezado_solicitudes
SELECT * FROM encabezado_solicitudes
SELECT * FROM detalles_accesoSistemas
SELECT * FROM detalles_altasUsers

SELECT * FROM tipos_solicitudes

update encabezado_solicitudes SET sol_estatusSolicitud = 1 
WHERE sol_id = 4

-- Consulta para ver datos en tipos_solicitudes


SELECT es.sol_id, es.sol_usuarioidSolicitante, es.sol_idTipo, ts.tipo_nombreSolicitud,
	   es.sol_fechaSolicitud, es.sol_autorizaNivel, es.sol_autorizacionNivel,
	   es.sol_fechaAutorizacionNivel, es.sol_jefeInfraestructura, es.sol_autorizacionJefeInfra, es.sol_fechaAutorizacionJefeInfra,
	   es.sol_jefeDesarrollo, es.sol_autorizacionJefeDesarrollo, es.sol_fechaAutorizacionJefeDesarrollo, es.sol_jefeSeguridad,
	   es.sol_autorizacionJefeSeguridad, es.sol_fechaAutorizacionJefeSeguridad, es.sol_gerenciaTI, es.sol_autorizacionGerenciaTI,
	   es.sol_fechaAutorizacionGerenciaTI, es.sol_direccionFinanzas, es.sol_autorizacionDirFinanzas, es.sol_fechaAutorizacionDirFinanzas,
	   es.sol_direccionGeneral, es.sol_autorizacionDirGeneral, es.sol_fechaAutorizacionDirGeneral, es.sol_estatusSolicitud
FROM encabezado_solicitudes AS es
JOIN tipos_solicitudes AS ts ON ts.tipo_id = es.sol_idTipo

SELECT da.altas_id, da.altas_idSolicitud,es.sol_usuarioidSolicitante, es.sol_idTipo, ts.tipo_nombreSolicitud,
	   es.sol_fechaSolicitud, es.sol_autorizaNivel, es.sol_autorizacionNivel,
	   es.sol_fechaAutorizacionNivel, es. sol_jefeInfraestructura, es.sol_autorizacionJefeInfra, es.sol_fechaAutorizacionJefeInfra,
	   es.sol_jefeDesarrollo, es.sol_autorizacionJefeDesarrollo, es.sol_fechaAutorizacionJefeDesarrollo, es.sol_jefeSeguridad,
	   es.sol_autorizacionJefeSeguridad, es.sol_fechaAutorizacionJefeSeguridad, es.sol_gerenciaTI, es.sol_autorizacionGerenciaTI,
	   es.sol_fechaAutorizacionGerenciaTI, es.sol_direccionFinanzas, es.sol_autorizacionDirFinanzas, es.sol_fechaAutorizacionDirFinanzas,
	   es.sol_direccionGeneral, es.sol_autorizacionDirGeneral, es.sol_fechaAutorizacionDirGeneral, es.sol_estatusSolicitud,
	   da.altas_nombreColaborador, da.altas_direccion, da.altas_gerencia, da.altas_jefatura,
       da.altas_fechaInicio, da.altas_fechaFin, da.altas_necesitaCorreo, da.altas_necesitaComputadora
FROM detalles_altasUsers AS da
JOIN encabezado_solicitudes AS es ON es.sol_id = da.altas_idSolicitud
JOIN tipos_solicitudes AS ts ON ts.tipo_id = es.sol_idTipo


--prueba 

--DELETE FROM encabezado_solicitudes
--DBCC CHECKIDENT(encabezado_solicitudes, RESEED, 0)
--DELETE FROM detalles_altasUsers
--DBCC CHECKIDENT(detalles_altasUsers, RESEED, 0)
--DELETE FROM detalles_accesoSistemas
--DBCC CHECKIDENT(detalles_accesoSistemas, RESEED, 0) 
--DELETE FROM detalles_recursoInfo
--DBCC CHECKIDENT(detalles_recursoInfo, RESEED, 0)
--DELETE FROM detalles_accesoCarpetas
--DBCC CHECKIDENT(detalles_accesoCarpetas, RESEED, 0)
--DELETE FROM detalles_accesoDatabase
--DBCC CHECKIDENT(detalles_accesoDatabase, RESEED, 0)
--DELETE FROM detalles_accesoInternet
--DBCC CHECKIDENT(detalles_accesoInternet, RESEED, 0)

--update encabezado_solicitudes set sol_autorizaNivel = 'svaldovines'
--WHERE sol_estatusSolicitud IS NULL

-- Llenar Procedimiento almacenado 

--EXEC sp_DetallesAltasUsuarios 
--	 @tipo_id = 1,
--	 @sol_usuarioidSolicitante = 'residenteTests',
--	 @sol_fechaSolicitud = '2023-04-25',
--	 @altas_nombreColaborador = 'Jonathan Rodriguez',
--	 @altas_jefeDirecto = 'gquiteno',
--	 @altas_idAreaPuesto = 1,
--	 @altas_idDepartamento = 1,
--	 @altas_fechaInicio = '2023-04-25',
--	 @altas_fechaFin = '2024-04-25',
--	 @altas_necesitaCorreo = 1,
--	 @altas_necesitaComputadora = 1

------------------------------------------------------------------------------------------------

--Prueba

--DELETE FROM encabezado_solicitudes
--DBCC CHECKIDENT(encabezado_solicitudes, RESEED, 0)
--DELETE FROM detalles_altasUsers
--DBCC CHECKIDENT(detalles_altasUsers, RESEED, 0)

--DROP PROCEDURE [sp_InsertarSolicitud];


--INSERT INTO tipos_solicitudes  (
--            tipo_nombreSolicitud,
--            tipo_autorizaNivel,
--			tipo_jefeInfraestructura,
--			tipo_jefeInfraNombre,
--			tipo_jefeSeguridad,
--			tipo_jefeSeguridadNombre,
--            tipo_gerenciaTI,
--			tipo_gerenciaTINombre
--            )
--VALUES ('Acceso a Internet', 3, 'ddoval','David Doval Galarza','jvillalobos','Javier Villalobos Becerra','galvarez','Guillermo Arturo Alvarez Perez')
--('Creaci�n y Acceso a Sistemas', 1, 'ddoval', 'David Doval Galarza', 'galvarez', 'Guillermo Arturo Alvarez Perez')
--('Acceso a Sistemas de Informaci�n', 2, 'ddoval', 'David Doval Galarza', 'jvillalobos', 'Javier Villalobos Becerra','galvarez', 'Guillermo Arturo Alvarez Perez')
--('Recurso Inform�tico', 2, 'ddoval','David Doval Galarza','gquiteno','Gibr�n Ernesto Quite�o Carrillo','galvarez','Guillermo Arturo Alvarez Perez','jtorres','Jorge Fernando Torres Maga�a','atronco','Arturo Tronco Guadiana')
--('Acceso a Carpetas', 3, 'ddoval','David Doval Galarza','gquiteno','Gibr�n Ernesto Quite�o Carrillo','jvillalobos','Javier Villalobos Becerra','galvarez','Guillermo Arturo Alvarez Perez')
--('Acceso a Base de Datos', 2, 'gquiteno','Gibr�n Ernesto Quite�o Carrillo','galvarez','Guillermo Arturo Alvarez Perez')
--('Acceso a Internet', 3, 'ddoval','David Doval Galarza','jvillalobos','Javier Villalobos Becerra','galvarez','Guillermo Arturo Alvarez Perez')


--DELETE FROM catalogo_departamento
--DBCC CHECKIDENT(catalogo_departamento, RESEED, 0)



--INSERT INTO catalogo_direccion (dir_nombre)
--VALUES ('Administraci�n y Finanzas'), ('Beneficio'), ('General'), ('Mina'),
--       ('Peletizado'), ('Recursos Humanos'), ('Tecnolog�a');

--SELECT * FROM catalogo_direccion

--INSERT INTO catalogo_gerencia (ger_nombre)
--VALUES ('Abastecimientos y Contratos'),
--       ('Administraci�n'),
--       ('Auditor�a Interna'),
--       ('Comunicaci�n y DESO'),
--       ('Contralor�a'),
--       ('Legal'),
--       ('Mantto El�ctrico e Instrum M y C'),
--       ('Mantto Mec�nico Mol y Conc'),
--       ('Mantenimiento Mec y El�c M�vil'),
--       ('Mantenimiento Peletizado'),
--       ('Operaci�n de Minas'),
--       ('Operaci�n y Embarques'),
--       ('Planeaci�n de Minas y Geolog�a'),
--       ('Planeamiento Econ�mico e Ind'),
--       ('Presas y L�neas de Conducci�n'),
--       ('Producci�n Molienda y Concent'),
--       ('Procesos, Calidad e Ing. Amb'),
--       ('Proyectos Generales'),
--       ('Proyectos Presas'),
--       ('Protecci�n Patrimonial'),
--       ('Recursos Humanos'),
--       ('Relaciones con la Comunidad'),
--       ('TI');
	   		 	  	  	   	
--SELECT * FROM catalogo_gerencia;

--INSERT INTO catalogo_jefatura (jef_nombre)
--VALUES ('Administraci�n de Mantenimiento'),
--       ('Administraci�n de Servicios'),
--       ('Almacenes'),
--       ('Beneficios y D&I'),
--       ('Capacitaci�n y Empleos'),
--       ('Compliance y Adm�n de Riesgos'),
--       ('Compras y Contratos'),
--       ('Control de Proyectos y Servicios'),
--       ('Desarrollo TI'),
--       ('Extracci�n Mina'),
--       ('HR Business Partners'),
--       ('Informaci�n Financiera y Proyectos'),
--       ('Infraestructura y Control'),
--       ('Infraestructura TI'),
--       ('Ingenier�a Industrial'),
--       ('Mantto a Equipo de Acarreo'),
--       ('Mantto a Equipo de Carga'),
--       ('Mantto Barrenaci�n y Eq Aux'),
--       ('Mantto Elec e Inst Mol y Con'),
--       ('Mantto Elec e Inst Pelet'),
--       ('Mantto Elec e Inst M�vil'),
--       ('Mantto Mec�nico Mol y Conc'),
--       ('Mantto Mec�nico Peletizado'),
--       ('N�mina y Cargas Sociales'),
--       ('Operaci�n'),
--       ('Planeaci�n de Mantenimiento'),
--       ('Planeaci�n de Minas'),
--       ('Planeaci�n de Mantto M�vil'),
--       ('Planta de Filtrado'),
--       ('Presas de Jales'),
--       ('Proceso y Calidad Mina'),
--       ('Proceso y Calidad Peletizado'),
--       ('Producci�n Mol y Conc'),
--       ('Proyectos Beneficio y Peletizado'),
--       ('Proyectos Mina'),
--       ('Proyectos Presas'),
--       ('Proyecto ACIP'),
--       ('Relaciones Laborales'),
--       ('Salud, Higiene y Bienestar'),
--       ('Seguridad'),
--       ('Seguridad de Proyectos'),
--       ('Servicios Generales e Infraest'),
--       ('Sistema de Gesti�n de Minas'),
--       ('Sist de Gesti�n Integral y Norma'),
--       ('Sustentabilidad Minas'),
--       ('Trituraci�n y Almac�n de Mineral');

--SELECT * FROM catalogo_jefatura;

--INSERT INTO catalogo_sistemasInfo (sist_nombre)
--VALUES ('Global'),
--       ('Masterweb'),
--       ('MneOps'),
--       ('SAP');

--SELECT * FROM catalogo_sistemasInfo;

--INSERT INTO catalogo_tipoRecursoInfo (recur_nombre)
--VALUES ('Hardware'),
--		('Software'),
--		('Perifericos'),
--		('Servicio'),
--		('Otro')

--SELECT * FROM catalogo_tipoRecursoInfo;

--INSERT INTO catalogo_tipoCarpeta (carpe_nombre)
--VALUES ('Carpetas de X'),
--		('Carpetas de W')

--SELECT * FROM catalogo_tipoCarpeta;

--INSERT INTO catalogo_tipoBaseDatos (base_nombre)
--VALUES ('vwebgama'),
--		('vwebdelta')

--SELECT * FROM catalogo_tipoBaseDatos;

--INSERT INTO catalogo_tipoInternet (inte_nombre)
--VALUES ('pcolorada'),
--		('smovil'),
--		('externos'),
--		('invitado')

--SELECT * FROM catalogo_tipoInternet;

--EXEC [dbo].[JEFE_INMEDIATO]'DESPARZA'