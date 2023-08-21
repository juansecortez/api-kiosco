import { Router } from "express";
import zonasUbicacionCtrl from "../controllers/zonasUbicacionCtrl ";

const router = Router();

// Rutas para Zonas
router.post("/zonas", zonasUbicacionCtrl.addZona);
router.put("/zonas", zonasUbicacionCtrl.editZona);
router.delete("/zonas/:id", zonasUbicacionCtrl.deleteZona);
router.get("/zonas", zonasUbicacionCtrl.listZonas);

// Rutas para Ubicacion
router.post("/ubicaciones", zonasUbicacionCtrl.addUbicacion);
router.put("/ubicaciones", zonasUbicacionCtrl.editUbicacion);
router.delete("/ubicaciones/:id", zonasUbicacionCtrl.deleteUbicacion);
router.get("/ubicaciones", zonasUbicacionCtrl.listUbicaciones);

export default router;
