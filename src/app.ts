import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';
import routes from "./routes";
import  {checkAndSendEmails}  from "./controllers/externosCtrl";
const path = require('path');

const rutaRecursoCompartido = '\\\\PCMS-NAS5001\\RecursosSistemas\\';

const app: express.Application = express();

// Middlewares esenciales
app.use(express.json());
app.use(fileUpload());
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
      "http://vwebdelta",
      "https://autorizaitk.pcolorada.com/"
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

setInterval(checkAndSendEmails, 24 * 60 * 60 * 1000);



// Ruta personalizada para acceder a archivos
app.get("/api/archivos/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(rutaRecursoCompartido, filename);
  res.sendFile(filePath);
});

// Rutas generales
app.get("/api/v1", (req, res) => {
  res.send({ message: "Bienvenido a la REST API del Kiosco de TI" });
});
app.use("/api/v1/mail", routes.emailRouter);
app.use("/api/v1/auth", routes.authRouter);
app.use("/api/v1/print", routes.printerRouter);
app.use("/api/v1/issues", routes.issueRouter);
app.use("/api/v1/make", routes.makeRequestRouter);
app.use("/api/v1/queries", routes.queriesRouter);
app.use("/api/v1/request", routes.requestRouter);
app.use("/api/v1/selects", routes.selectsRouter);
app.use("/api/v1/recursos", routes.recurzoRouter);
app.use("/api/v1/solicitud", routes.solicitudRouter);
app.use("/api/v1/Ubicacion", routes.zonasUbicacionRouter);
app.use("/api/v1/externos", routes.externosRouter);
app.use("/api/v1/device", routes.deviceRouter);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  console.log('Ruta no encontrada para:', req.path);
  res.status(404).send('Ruta no encontrada');
});

export default app;
