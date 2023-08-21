import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

import { IDecodeToken, IUserData } from "../interfaces";
import { generateAccessToken, generateRefreshToken } from "../config/tokens";
import { getconectionKiosco } from "../config/database";


const authCtrl = {
  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshtoken", {
        path: "/api/v1/auth/refresh_token",
      });
      return res.json({ message: "Logged out!" });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(401).json({ message: "Por favor inicia sesión." });
      const decoded = <IDecodeToken>(
        jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded.USUARIOID)
        return res.status(401).json({ message: "Por favor inicia sesión." });

      const params = new URLSearchParams();
      params.append("usuarioid", decoded.USUARIOID);
      const result = await axios.post(
        "http://vwebdelta/WebDataSap/Service1.asmx/EXISTE_USUARIO",
        params
      );
      if (typeof result.data === "string") {
        return res.json({ message: "El usuario no existe." });
      }
      const user: IUserData = result.data[0];
      if (!user)
        return res.status(400).json({ message: "La cuenta no existe." });
      const { USUARIOID, NOMBRE, NOEMPLEADO, role, direcciones } = decoded;
      const access_token = generateAccessToken({
        USUARIOID,
        NOMBRE,
        NOEMPLEADO,
        role,
        direcciones,
      });
      res.json({
        access_token,
        user: {
          USUARIOID,
          NOMBRE,
          NOEMPLEADO,
          role,
          direcciones,
        },
      });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({ message: "El servidor no responde." });
    }
  },
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      const pool = await getconectionKiosco();
      if (pool === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }

      // Se asigna el rol de usuario normal por default
      let role = "Normal";
      // Se asigna el rol de administrador si el usuario se encuentra en el array
      const adminUsers = ["galvarez", "gquiteno", "ddoval", "ezamora"];
      if (adminUsers.includes(username)) {
        role = "Administrador";
      } else {
        role = "Normal";
      }

      
      // Validar usuario del directorio activo
      const params = new URLSearchParams();
      params.append("usuario", username);
      params.append("contrasena", password);
      const result = await axios.post(
        "http://vwebdelta/WebDataSap/Service1.asmx/VALIDA_USUARIO",
        params
      );

      if (Object.keys(result.data).length === 0) {
        return res.status(401).json({
          message: "No cuentas con las credenciales para acceder al sistema",
        });
      }
      if (typeof result.data === "string") {
        return res.status(401).json({
          message: "El usuario o la contraseña son incorrectos",
        });
      }
      const user: IUserData = result.data[0];
      const { USUARIOID, NOMBRE, NOEMPLEADO, PUESTO, NIVELFIRMA } = user;

      const pool2 = await getconectionKiosco();
      if (pool2 === false) {
        return res.status(400).json({
          message: "La base de datos no responde.",
        });
      }
      pool2.close();
      const access_token = generateAccessToken({
        USUARIOID,
        NOMBRE,
        NOEMPLEADO,
        PUESTO,
        NIVELFIRMA,
        role,
      });
      const refresh_token = generateRefreshToken({
        USUARIOID,
        NOMBRE,
        NOEMPLEADO,
        PUESTO,
        NIVELFIRMA,
        role,
      });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refresh_token",
        maxAge: 7_200_000, //  Dos horas
      });
      res.json({
        message: "Login Success!",
        access_token,
        user: {
          USUARIOID,
          NOMBRE,
          NOEMPLEADO,
          PUESTO,
          NIVELFIRMA,
          role,
        },
      });
    } catch (error: any) {
      console.log({ message: error.message });
      return res.status(500).json({
        message: "El servidor no responde",
      });
    }
  },
};

export default authCtrl;
