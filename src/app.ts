import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes";

//Middleware
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      "http://localhost:4002",
      "http://localhost:4001",
      "http://localhost:4200",
      "http://vwebgama:4002",
      "http://vwebgama:4001",
      "http://vwebgama:8093",
      ""
    
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

//Routes
app.get("/api/v1", (req, res) => {
  res.send({ message: "Bienvenido a la REST API del Kiosco de TI" });
});
app.use("/api/v1/mail", routes.emailRouter);
app.use("/api/v1/auth", routes.authRouter);
app.use("/api/v1/print", routes.printerRouter);
app.use("/api/v1/make", routes.makeRequestRouter);
app.use("/api/v1/queries", routes.queriesRouter);
app.use("/api/v1/request", routes.requestRouter);
app.use("/api/v1/selects", routes.selectsRouter);
app.use("/api/v1/recursos", routes.recurzoRouter);
app.use("/api/v1/solicitud", routes.solicitudRouter);
app.use("/api/v1/Ubicacion", routes.zonasUbicacionRouter);
app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada');
});

export default app;
