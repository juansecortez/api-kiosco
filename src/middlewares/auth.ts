import axios from "axios";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IDecodeToken, IReqAuth } from "../interfaces";

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res.status(400).json({ message: "Autenticación inválida." });
    const decoded = <IDecodeToken>(
      jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    );
    if (!decoded)
      return res.status(400).json({ message: "Autenticación inválida." });
    if (!decoded.USUARIOID)
      return res.status(401).json({ message: "Inicie sesión ahora." });
    const params = new URLSearchParams();
    params.append("usuarioid", decoded.USUARIOID);
    const result = await axios.post(
      "http://vwebdelta/WebDataSap/Service1.asmx/EXISTE_USUARIO",
      params
    );
    if (typeof result.data === "string") {
      return res.json({ message: "El usuario no existe" });
    }
    const {
      USUARIOID,
      NOMBRE,
      NOEMPLEADO,
      PUESTO,
      NIVELFIRMA,
      direcciones,
      role,
    } = decoded;
    req.user = {
      USUARIOID,
      NOMBRE,
      NOEMPLEADO,
      PUESTO,
      NIVELFIRMA,
      direcciones,
      role,
    };
    next();
  } catch (error: any) {
    console.log({ message: error.message });
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Inicie sesión ahora." });
    }
    return res.status(500).json({ message: error.message });
  }
};
export default auth;
