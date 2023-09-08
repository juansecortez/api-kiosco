import { Router } from "express";
import solicitudCtrl from "../controllers/solicitudCtrl";

const router = Router();

router.put("/cambiarEstadoServicio", solicitudCtrl.cambiarEstadoServicio);
router.get("/listarSolicitudes", solicitudCtrl.listarSolicitudes);
router.get("/listarSolicitudesId/:userID", solicitudCtrl.listarSolicitudesId);
router.post("/crearSolicitud", solicitudCtrl.crearSolicitud);
router.post("/agregarComentario", solicitudCtrl.agregarComentario);
router.get('/comentarios/:ID_Servicio', solicitudCtrl.listarComentariosPorServicio);
router.get('/servicio/:ID', solicitudCtrl.getServiceById);
router.post("/subirImagen", solicitudCtrl.subirImagen);
router.get('/imagen/servicio/:ID_Servicio', solicitudCtrl.imagenPorServicio);
router.get('/imagen/comentario/:ID_Comentario', solicitudCtrl.imagenPorComentario);
router.get('/imagen/externo/:ID_Externo', solicitudCtrl.imagenPorExterno);

export default router;
