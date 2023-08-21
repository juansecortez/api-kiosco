import { Router } from "express";
import solicitudCtrl from "../controllers/solicitudCtrl";

const router = Router();

router.put("/cambiarEstadoServicio", solicitudCtrl.cambiarEstadoServicio);
router.get("/listarSolicitudes", solicitudCtrl.listarSolicitudes);
router.post("/crearSolicitud", solicitudCtrl.crearSolicitud);
router.post("/agregarComentario", solicitudCtrl.agregarComentario);
router.get('/comentarios/:ID_Servicio', solicitudCtrl.listarComentariosPorServicio);
router.get('/servicio/:ID', solicitudCtrl.getServiceById);


export default router;
