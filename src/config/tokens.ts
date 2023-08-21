import jws from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const generateActiveToken = (payload: object) => {
  return jws.sign(payload, `${process.env.ACTIVE_TOKEN_SECRET}`, {
    expiresIn: "5m",
  });
};

export const generateAccessToken = (payload: object) => {
  return jws.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jws.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: "120m",
  });
};
