import { Router } from "express";
import recurzoCtrl from "../controllers/recurzoCtrl";

const router = Router();

router.post("/addRecurso", recurzoCtrl.addRecurzo);
router.put("/editRecurso/:id", recurzoCtrl.editRecurzo);
router.delete("/deleteRecurso/:id", recurzoCtrl.deleteRecurzo);
router.get("/getAllRecursos", recurzoCtrl.getAllRecurzos);
router.get("/getEmpleado/:codigoEmpleado", recurzoCtrl.getEmpleadoByCodigo); // Agregar esta línea
router.post("/insertEmpleadoSolicitud", recurzoCtrl.insertEmpleadoSolicitud); // Agregar esta línea
router.get("/getAllEmpleadoSolicitud", recurzoCtrl.getAllEmpleadoSolicitud); // Agregar esta línea
router.delete("/eliminarEmpleadoSolicitudPorCampos/:HoraInicio/:HoraFinalizacion/:NOMBRE", recurzoCtrl.eliminarEmpleadoSolicitudPorCampos);
router.delete("/eliminarEmpleadoSolicitudPorId/:id", recurzoCtrl.eliminarEmpleadoSolicitudPorId);
router.get("/listarEmpleadoSolicitudPorIdSolicitante/:IdSolicitante", recurzoCtrl.listarEmpleadoSolicitudPorIdSolicitante);
router.get("/listarEmpleadoSolicitudPorIdGerente/:IdGerente", recurzoCtrl.listarEmpleadoSolicitudPorIdGerente);

router.put("/agregarEstadoSolicitud/:IdSolicitud", recurzoCtrl.agregarEstadoSolicitud);

export default router;
