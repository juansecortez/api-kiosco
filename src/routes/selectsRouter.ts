import { Router } from "express";
import selectsCtrl from "../controllers/selectsCtrl";

const router = Router();

router.get("/directions", selectsCtrl.directions);
router.get("/management", selectsCtrl.management);
router.get("/leadership", selectsCtrl.leadership);
router.get("/systems", selectsCtrl.systems);
router.get("/resource", selectsCtrl.resource);
router.get("/folder", selectsCtrl.folder);
router.get("/database", selectsCtrl.database);
router.get("/internet", selectsCtrl.internet);
router.get("/userRegistrationID", selectsCtrl.userRegistrationID);
router.get("/systemsID", selectsCtrl.systemsID);
router.get("/resourceID", selectsCtrl.resourceID);
router.get("/folderID", selectsCtrl.folderID);
router.get("/databaseID", selectsCtrl.databaseID);
router.get("/internetID", selectsCtrl.internetID);
router.get("/earrings", selectsCtrl.earrings);
router.get("/getRecursos/:tipo_id", selectsCtrl.getRecurzosByType);
router.get('/execute/:cadena', selectsCtrl.executeSP);


export default router;
