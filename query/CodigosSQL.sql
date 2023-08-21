--Uso de base de datos
use KioscoIT

-- TABLAS

create table tipos_solicitudes(
	tipo_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	tipo_nombreSolicitud varchar(50),
	tipo_autorizaNivel int,
	tipo_jefeInfraestructura varchar(15),
	tipo_jefeInfraNombre varchar(50),
	tipo_jefeDesarrollo varchar(15),
	tipo_jefeDesarrolloNombre varchar(50),
	tipo_jefeSeguridad varchar(15),
	tipo_jefeSeguridadNombre varchar(50),
	tipo_gerenciaTI varchar(15),
	tipo_gerenciaTINombre varchar(50),
	tipo_direccionFinanzas varchar(15),
	tipo_dirFinanzasNombre varchar(50),
	tipo_direccionGeneral varchar(15),
	tipo_dirGeneralNombre varchar(50),
);

create table encabezado_solicitudes (
	sol_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	sol_idTipo int FOREIGN KEY REFERENCES tipos_solicitudes (tipo_id),
	sol_usuarioidSolicitante varchar(15),
	sol_fechaSolicitud date,
	sol_autorizaNivel varchar(15),
	sol_autorizaNivelNombre varchar(50),
	sol_autorizacionNivel bit,
	sol_fechaAutorizacionNivel date,
	sol_jefeInfraestructura varchar(15),
	sol_jefeInfraNombre varchar(50),
	sol_autorizacionJefeInfra bit,
	sol_fechaAutorizacionJefeInfra date,
	sol_jefeDesarrollo varchar(15),
	sol_jefeDesarrolloNombre varchar(50),
	sol_autorizacionJefeDesarrollo bit,
	sol_fechaAutorizacionJefeDesarrollo date,
	sol_jefeSeguridad varchar(15),
	sol_jefeSeguridadNombre varchar(50),
	sol_autorizacionJefeSeguridad bit,
	sol_fechaAutorizacionJefeSeguridad date,
	sol_gerenciaTI varchar(15),
	sol_gerenciaTINombre varchar(50),
	sol_autorizacionGerenciaTI bit,
	sol_fechaAutorizacionGerenciaTI date,
	sol_direccionFinanzas varchar(15),
	sol_dirFinanzasNombre varchar(50),
	sol_autorizacionDirFinanzas bit,
	sol_fechaAutorizacionDirFinanzas date,
	sol_direccionGeneral varchar(15),
	sol_dirGeneralNombre varchar(50),
	sol_autorizacionDirGeneral bit,
	sol_fechaAutorizacionDirGeneral date,
	sol_estatusSolicitud int,
);

create table catalogo_direccion (
	dir_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	dir_nombre varchar(50),
);

create table catalogo_gerencia (
	ger_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	ger_nombre varchar(50),
);

create table catalogo_jefatura (
	jef_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	jef_nombre varchar(50),
);

create table detalles_altasUsers (
	altas_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	altas_idSolicitud int FOREIGN KEY REFERENCES encabezado_solicitudes (sol_id),
	altas_nombreColaborador varchar(250),
	altas_direccion varchar(50),
	altas_gerencia varchar(50),
	altas_jefatura varchar(50),
	altas_fechaInicio date,
	altas_fechaFin date,
	altas_necesitaCorreo int,
	altas_necesitaComputadora int,
);

create table catalogo_sistemasInfo (
	sist_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	sist_nombre varchar(50),
);

create table detalles_accesoSistemas (
	sis_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	sis_idSolicitud int FOREIGN KEY REFERENCES encabezado_solicitudes (sol_id),
	sis_direccion varchar(50),
	sis_gerencia varchar(50),
	sis_jefatura varchar(50),
	sis_nombreSistema varchar(50),
	sis_funcionDesarrollar varchar(250),
);

create table catalogo_tipoRecursoInfo (
	recur_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	recur_nombre varchar(50),
);

create table detalles_recursoInfo (
	recu_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	recu_idSolicitud int FOREIGN KEY REFERENCES encabezado_solicitudes (sol_id),
	recu_direccion varchar(50),
	recu_gerencia varchar(50),
	recu_jefatura varchar(50),
	recu_solicitante varchar(50),
	recu_justificacion varchar(250),
	recu_tipoRecursoInfo varchar(50),
	recu_cantidad int,
	recu_descripcion varchar(50),
);

create table catalogo_tipoCarpeta (
	carpe_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	carpe_nombre varchar(50),
);

create table detalles_accesoCarpetas (
	carp_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	carp_idSolicitud int FOREIGN KEY REFERENCES encabezado_solicitudes (sol_id),
	carp_direccion varchar(50),
	carp_gerencia varchar(50),
	carp_jefatura varchar(50),
	carp_solicitante varchar(50),
	carp_justificacion varchar(250),
	carp_tipoCarpeta varchar(50),
	carp_descripcion varchar(50),
);

create table catalogo_tipoBaseDatos (
	base_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	base_nombre varchar(50),
);

create table detalles_accesoDatabase (
	bd_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	bd_idSolicitud int FOREIGN KEY REFERENCES encabezado_solicitudes (sol_id),
	bd_direccion varchar(50),
	bd_gerencia varchar(50),
	bd_jefatura varchar(50),
	bd_solicitante varchar(50),
	bd_justificacion varchar(250),
	bd_tipoBaseDatos varchar(50),
	bd_descripcion varchar(50),
);

create table catalogo_tipoInternet (
	inte_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	inte_nombre varchar(50),
);

create table detalles_accesoInternet (
	int_id int IDENTITY(1,1) PRIMARY KEY NOT NULL,
	int_idSolicitud int FOREIGN KEY REFERENCES encabezado_solicitudes (sol_id),
	int_direccion varchar(50),
	int_gerencia varchar(50),
	int_jefatura varchar(50),
	int_solicitante varchar(50),
	int_justificacion varchar(250),
	int_tipoInternet varchar(50),
	int_descripcion varchar(50),
);
