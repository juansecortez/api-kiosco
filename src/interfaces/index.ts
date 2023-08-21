import { Request } from "express";

export interface IDecodeToken {
  USUARIOID: string;
  NOMBRE: string;
  NOEMPLEADO: string;
  PUESTO: string;
  NIVELFIRMA: string;
  direcciones: [];
  role: string;
  iat: number;
  exp: number;
}
export interface IUserData {
  USUARIOID: string;
  NOMBRE: string;
  NOEMPLEADO: string;
  PUESTO: string;
  NIVELFIRMA: string;
  direcciones: [];
  role: string;
}
export interface IReqAuth extends Request {
  user?: IUserData;
}
export interface IUser {
  usuario_id: string;
  nombre: string;
  role: string;
}
export interface IUserDirection extends IUser {
  id_direccion: number;
}
export interface IRecurzo {
  nombre: string,
  descripcion: string,
  precio: number,
  tipo_id: number
}
