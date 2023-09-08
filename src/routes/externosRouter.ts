import { Router } from "express";
import externosCtrl from "../controllers/externosCtrl";

const router = Router();

// Rutas para Externos
router.post("/externos", externosCtrl.addExterno);
router.put("/externos/:id", externosCtrl.editExterno);
router.delete("/externos/:id", externosCtrl.deleteExterno);
router.get("/externos", externosCtrl.listExternos);

export default router;
